import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { ABCompare } from '@/features/speaking/ABCompare';
import { RecorderControls } from '@/features/speaking/RecorderControls';
import { ScorePanel } from '@/features/speaking/ScorePanel';
import { SentencePlayer } from '@/features/speaking/SentencePlayer';
import { useContent } from '@/hooks/useContent';
import { useRecorder } from '@/hooks/useRecorder';
import { useTTS } from '@/hooks/useTTS';
import { resolveSpeakingMode } from '@/lib/capability';
import type { SpeakingModeResult } from '@/lib/capability';
import { cn } from '@/lib/cn';
import { recognizeOnce, scoreFromSimilarity, similarity } from '@/lib/speechScore';
import type { RecognitionSession } from '@/lib/speechScore';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { SpeakingScore } from '@/types';

/**
 * 跟读模块（P0-11 / P0-12 / P0-13）。
 *
 * 【致命坑 #1】能力检测只在挂载时算一次存入 state；离线 / iOS / 不支持识别
 * 一律退化为模式B（自评打星）并给出明确原因，绝不让用户干等一个永远不回来的识别结果。
 * 另外监听 offline 事件做二次降级 —— 用户可能进页面后才断网。
 */
export function SpeakingPage(): JSX.Element {
  const params = useParams<{ level: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;

  const { data, loading, error } = useContent(level, 'speaking');
  const sentences = data?.items ?? [];

  const scores = useProgressStore((s) => (level ? (s.byLevel[level]?.speaking.scores ?? {}) : {}));
  const lastSentenceId = useProgressStore((s) => (level ? s.byLevel[level]?.speaking.lastSentenceId : undefined));
  const addSpeakingScore = useProgressStore((s) => s.addSpeakingScore);
  const recordAction = useAppStore((s) => s.recordAction);

  // 能力检测：挂载时算一次
  const [modeInfo, setModeInfo] = useState<SpeakingModeResult>(() => resolveSpeakingMode());
  const [activeIndex, setActiveIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [latest, setLatest] = useState<SpeakingScore | null>(null);
  const [scoring, setScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);
  /** 本次识别失败 → 临时降级为自评，不改变全局模式判定 */
  const [fallbackManual, setFallbackManual] = useState(false);
  const [heardDemo, setHeardDemo] = useState(false);
  const [rateTouched, setRateTouched] = useState(false);

  const recognitionRef = useRef<RecognitionSession | null>(null);
  const recognitionPromiseRef = useRef<Promise<string> | null>(null);

  const recorder = useRecorder();
  const tts = useTTS(0.9);
  const { setRate } = tts;

  const active = sentences[activeIndex] ?? null;
  const effectiveMode = fallbackManual ? 'manual' : modeInfo.mode;
  const effectiveReason = fallbackManual ? scoreError : modeInfo.reason;

  // 进页面后才断网 → 二次降级
  useEffect(() => {
    const onOffline = (): void => {
      setModeInfo((prev) => (prev.mode === 'manual' ? prev : { mode: 'manual', reason: '离线状态下改为自评模式' }));
    };
    const onOnline = (): void => setModeInfo(resolveSpeakingMode());
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  // 卸载：放弃未完成的识别，避免回调打到已卸载组件
  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      recognitionPromiseRef.current = null;
    },
    [],
  );

  // 恢复上次跟读的句子
  useEffect(() => {
    if (restored || sentences.length === 0) return;
    const index = lastSentenceId ? sentences.findIndex((item) => item.id === lastSentenceId) : -1;
    setActiveIndex(index >= 0 ? index : 0);
    setRestored(true);
  }, [restored, sentences, lastSentenceId]);

  // 内容作者指定的语速：用户未手动调过时才生效
  useEffect(() => {
    if (!active || rateTouched) return;
    if (typeof active.speakRate === 'number' && active.speakRate > 0) setRate(active.speakRate);
  }, [active, rateTouched, setRate]);

  const { reset: resetRecorder, stop: stopRecorder } = recorder;
  const { stop: stopSpeaking } = tts;

  // 切句：清空本句的临时状态
  const switchTo = useCallback(
    (index: number) => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      recognitionPromiseRef.current = null;
      stopSpeaking();
      resetRecorder();
      setLatest(null);
      setScoreError(null);
      setFallbackManual(false);
      setHeardDemo(false);
      setScoring(false);
      setActiveIndex(index);
    },
    [resetRecorder, stopSpeaking],
  );

  const persistScore = useCallback(
    (record: SpeakingScore) => {
      if (!level || !active) return;
      addSpeakingScore(level, record);
      setLatest(record);
      recordAction({
        level,
        module: 'speaking',
        route: modulePath(level, 'speaking'),
        itemId: active.id,
        itemIndex: activeIndex,
        label: `${levelName(level)} · 跟读第 ${activeIndex + 1} 句`,
      });
    },
    [level, active, activeIndex, addSpeakingScore, recordAction],
  );

  const handleStart = useCallback(async () => {
    if (!active) return;
    setLatest(null);
    setScoreError(null);
    setFallbackManual(false);
    resetRecorder();

    // 识别与录音必须在同一次用户手势里发起
    if (modeInfo.mode === 'auto') {
      const session = recognizeOnce('en-US');
      recognitionRef.current = session;
      recognitionPromiseRef.current = session.promise;
      // 预挂空 catch，防止 stop 前就 reject 触发 unhandledrejection
      session.promise.catch(() => undefined);
    }

    await recorder.start();
  }, [active, modeInfo.mode, recorder, resetRecorder]);

  const handleStop = useCallback(async () => {
    if (!active) return;
    setScoring(true);
    await stopRecorder();

    const session = recognitionRef.current;
    const promise = recognitionPromiseRef.current;
    recognitionRef.current = null;
    recognitionPromiseRef.current = null;

    if (modeInfo.mode === 'auto' && session && promise) {
      session.stop();
      try {
        const transcript = await promise;
        const sim = similarity(active.text, transcript);
        const score = scoreFromSimilarity(sim);
        persistScore({
          sentenceId: active.id,
          mode: 'auto',
          recognizedText: transcript,
          similarity: sim,
          score,
          durationMs: recorder.durationMs,
          createdAt: Date.now(),
        });
        toast(`本句得分 ${score}`, 'success');
      } catch (err) {
        const message = err instanceof Error ? err.message : '语音识别失败';
        setScoreError(`${message}，本次改为自评打星`);
        setFallbackManual(true);
        toast(message, 'warning');
      }
    }

    setScoring(false);
  }, [active, modeInfo.mode, persistScore, recorder.durationMs, stopRecorder]);

  const handleSelfRate = useCallback(
    (stars: number) => {
      if (!active) return;
      persistScore({
        sentenceId: active.id,
        mode: 'manual',
        stars,
        durationMs: recorder.durationMs,
        createdAt: Date.now(),
      });
      toast(`已记录 ${stars} 星自评`, 'success');
    },
    [active, persistScore, recorder.durationMs],
  );

  const handlePlayDemo = useCallback(() => {
    if (!active) return;
    setHeardDemo(true);
    tts.speak(active.text);
  }, [active, tts]);

  if (!level) {
    return (
      <PageContainer>
        <EmptyState
          icon="级"
          title="难度参数无效"
          desc="请先选择一个学习难度。"
          action={<Button onClick={() => navigate('/levels')}>去选择难度</Button>}
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <div className="h-10 w-full rounded-card bg-line" />
        <div className="h-32 w-full rounded-card border border-line bg-parchment" />
        <div className="h-40 w-full rounded-card border border-line bg-parchment" />
      </PageContainer>
    );
  }

  if (error || !active) {
    return (
      <PageContainer>
        <EmptyState
          icon="说"
          title="暂时没有跟读内容"
          desc={error ?? '该难度的跟读包为空，请稍后再试或切换难度。'}
          action={<Button onClick={() => navigate('/levels')}>切换难度</Button>}
        />
      </PageContainer>
    );
  }

  const history = scores[active.id] ?? [];
  const practicedCount = sentences.filter((item) => (scores[item.id]?.length ?? 0) > 0).length;

  return (
    <PageContainer className="flex flex-col gap-4">
      {/* 句子切换 */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {sentences.map((sentence, index) => {
          const done = (scores[sentence.id]?.length ?? 0) > 0;
          return (
            <button
              key={sentence.id}
              type="button"
              onClick={() => switchTo(index)}
              className={cn(
                'flex min-h-tap shrink-0 items-center gap-1 rounded-full border px-3 text-sm transition-colors duration-150',
                index === activeIndex ? 'border-moss bg-moss-light text-moss-dark' : 'border-line text-ink-soft',
              )}
            >
              <span>第 {index + 1} 句</span>
              {done ? <span className="text-xs text-terra">已练</span> : null}
            </button>
          );
        })}
      </div>

      <Card className="flex items-center justify-between py-3">
        <p className="text-xs text-ink-soft">
          {levelName(level)} · 已练 {practicedCount}/{sentences.length} 句
        </p>
        <span className="text-xs text-ink-soft">{effectiveMode === 'auto' ? '自动评分' : '自评模式'}</span>
      </Card>

      <SentencePlayer
        sentence={active}
        available={tts.available}
        speaking={tts.speaking}
        rate={tts.rate}
        onRateChange={(rate) => {
          setRateTouched(true);
          tts.setRate(rate);
        }}
        looping={tts.looping}
        onLoopingChange={tts.setLooping}
        onPlay={handlePlayDemo}
        onStop={tts.stop}
      />

      <RecorderControls
        supported={recorder.supported}
        recording={recorder.recording}
        scoring={scoring}
        getAnalyser={recorder.getAnalyser}
        onStart={() => void handleStart()}
        onStop={() => void handleStop()}
        error={recorder.error}
      />

      <ABCompare
        blobUrl={recorder.blobUrl}
        demoAvailable={tts.available}
        demoPlaying={tts.speaking}
        onPlayDemo={handlePlayDemo}
        onStopDemo={tts.stop}
      />

      <ScorePanel
        mode={effectiveMode}
        reason={effectiveReason}
        latest={latest}
        history={history}
        onSelfRate={handleSelfRate}
        canSelfRate={Boolean(recorder.blobUrl) || heardDemo}
      />

      <div className="flex items-center gap-3 pb-2">
        <Button
          variant="ghost"
          block
          onClick={() => switchTo(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          上一句
        </Button>
        <Button
          variant="ghost"
          block
          onClick={() => switchTo(Math.min(sentences.length - 1, activeIndex + 1))}
          disabled={activeIndex >= sentences.length - 1}
        >
          下一句
        </Button>
      </div>
    </PageContainer>
  );
}
