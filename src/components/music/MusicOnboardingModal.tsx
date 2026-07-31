import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

/**
 * 首次进入的背景音乐引导（onboarded === false 时弹出）。
 *
 * 关键约束：点「开启」时必须在**该 click 事件的同步调用栈内**创建并 resume
 * AudioContext，任何 await / setTimeout 之后再调都会被 iOS Safari 拦截，
 * 表现为「开关是开的但没声音」。因此这里直接调用 `toggle()`
 * （其内部第一步就是同步 `audioEngine.unlock()`），不做任何异步前置。
 */
export function MusicOnboardingModal(): JSX.Element | null {
  const { available, onboarded, enabled, toggle, markOnboarded } = useBackgroundMusic();

  if (!available || onboarded) return null;

  const handleEnable = (): void => {
    if (!enabled) toggle();
    markOnboarded();
    toast('背景音乐已开启，可在右上角调整', 'neutral');
  };

  const handleSkip = (): void => {
    markOnboarded();
  };

  return (
    <Modal
      open
      dismissable={false}
      title="要来点背景音吗？"
      footer={
        <div className="flex flex-col gap-2 pb-1">
          <Button block onClick={handleEnable}>
            开启背景音
          </Button>
          <Button block variant="ghost" onClick={handleSkip}>
            暂不需要
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3 pb-1">
        <p className="text-sm leading-relaxed text-ink-soft">
          雨声 / 白噪 / 轻琶音三档环境音，全部由浏览器实时合成，不下载任何音频文件，
          离线也能用，随时可在右上角关闭。
        </p>
        <ul className="flex flex-col gap-1 text-sm text-ink-soft">
          <li>· 雨声：细雨滤波噪声，适合背单词</li>
          <li>· 白噪：遮蔽环境杂音，适合做题</li>
          <li>· 琶音：五声音阶轻旋律，适合阅读</li>
        </ul>
      </div>
    </Modal>
  );
}
