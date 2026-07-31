import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import type { WordState } from '@/types';

export interface WordStateSwitchProps {
  value: WordState;
  onChange: (state: WordState) => void;
}

const OPTIONS: SegmentedOption<WordState>[] = [
  { value: 'new', label: '生词' },
  { value: 'learning', label: '学习中' },
  { value: 'mastered', label: '已掌握' },
];

/**
 * 单词三态标记（P0-03）。
 * 标记动作即「模块动作」，由 WordsPage 在 onChange 里调用 recordAction() 参与打卡。
 */
export function WordStateSwitch({ value, onChange }: WordStateSwitchProps): JSX.Element {
  return (
    <SegmentedControl<WordState>
      options={OPTIONS}
      value={value}
      onChange={onChange}
      label="记忆状态"
      className="w-full"
    />
  );
}
