import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/cn';

export type NavKey = 'home' | 'progress' | 'wrongbook';

export interface BottomNavProps {
  /** 由路由 handle 指定的高亮项；缺省时按 NavLink 自身 active 判断 */
  active?: NavKey;
}

interface NavItem {
  key: NavKey;
  to: string;
  label: string;
  icon: JSX.Element;
}

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true,
} as const;

const ITEMS: NavItem[] = [
  {
    key: 'home',
    to: '/',
    label: '首页',
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-8.5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'progress',
    to: '/progress',
    label: '进度',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M5 19V11M12 19V5M19 19v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'wrongbook',
    to: '/wrongbook',
    label: '错题本',
    icon: (
      <svg {...ICON_PROPS}>
        <path
          d="M6 4h9l4 4v12H6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M10 11l4 4M14 11l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

/** 底部导航：首页 / 进度 / 错题本。热区 ≥44px，底部留安全区。 */
export function BottomNav({ active }: BottomNavProps): JSX.Element {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-app border-t border-line bg-paper/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="主导航"
    >
      <ul className="flex">
        {ITEMS.map((item) => (
          <li key={item.key} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-tap flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors duration-150',
                  (active ? active === item.key : isActive) ? 'text-moss-dark' : 'text-ink-soft',
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
