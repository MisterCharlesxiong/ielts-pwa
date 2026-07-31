import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  /** 无障碍描述，缺省用 label */
  ariaLabel?: string;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  label?: string;
  /** 紧凑模式（阅读控制条用） */
  dense?: boolean;
}

/**
 * 三态切换 / 字号三档。选中态用苔绿浅底 + 苔绿文字，不使用暖陶色。
 */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className = '',
  label = '切换',
  dense = false,
}: SegmentedControlProps<T>): JSX.Element {
  return (
    <div
      className={cn('inline-flex rounded-card border border-line bg-paper p-1', className)}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.ariaLabel ?? option.label}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 rounded-[10px] text-center transition-colors duration-150',
              dense ? 'min-h-[36px] px-3 text-sm' : 'min-h-tap px-4 text-base',
              active ? 'bg-moss-light font-medium text-moss-dark' : 'text-ink-soft',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
