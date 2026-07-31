import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import { READING_FONT_SIZES } from '@/store/useReadingPrefStore';
import type { ReadingFontSize, ReadingTheme } from '@/types';

export interface ReadingControlsProps {
  theme: ReadingTheme;
  onThemeChange: (theme: ReadingTheme) => void;
  fontSize: ReadingFontSize;
  onFontSizeChange: (size: ReadingFontSize) => void;
  className?: string;
}

const THEME_OPTIONS: SegmentedOption<ReadingTheme>[] = [
  { value: 'parchment', label: '羊皮纸', ariaLabel: '羊皮纸底色' },
  { value: 'night', label: '夜间', ariaLabel: '夜间墨屏底色' },
];

/** 17 / 18 / 20 三档，行高恒定 1.9 不提供调节 */
const FONT_LABEL: Record<ReadingFontSize, string> = {
  17: '小',
  18: '中',
  20: '大',
};

const FONT_OPTIONS: SegmentedOption<ReadingFontSize>[] = READING_FONT_SIZES.map((size) => ({
  value: size,
  label: FONT_LABEL[size],
  ariaLabel: `正文字号 ${size} 像素`,
}));

/**
 * 专注阅读控制条：底色切换 + 字号三档（P0-07）。
 * 只做偏好切换，不产生学习动作，因此**不调用 recordAction**。
 */
export function ReadingControls({
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  className = '',
}: ReadingControlsProps): JSX.Element {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <span className="shrink-0 text-sm text-ink-soft">底色</span>
        <SegmentedControl
          options={THEME_OPTIONS}
          value={theme}
          onChange={onThemeChange}
          label="阅读底色"
          dense
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="shrink-0 text-sm text-ink-soft">字号</span>
        <SegmentedControl
          options={FONT_OPTIONS}
          value={fontSize}
          onChange={onFontSizeChange}
          label="正文字号"
          dense
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        行高固定 1.9，长时间阅读更省力；偏好会自动保存到本机。
      </p>
    </div>
  );
}
