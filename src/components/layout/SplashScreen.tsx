/**
 * Hydration 期间的骨架屏。
 *
 * 只用静态骨架块，不放无限循环动画（耗电 + 与护眼定位冲突），
 * 仅用一条 ≤300ms 的呼吸过渡由 CSS transition 承担。
 */
export function SplashScreen(): JSX.Element {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col gap-4 bg-paper px-4 pt-16" aria-busy="true" aria-label="加载中">
      <div className="flex flex-col items-center gap-3">
        <div className="h-[108px] w-[108px] rounded-full border-8 border-line" />
        <div className="h-4 w-24 rounded-full bg-line" />
      </div>

      <div className="mt-4 h-[92px] w-full rounded-card border border-line bg-parchment" />

      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="h-[84px] rounded-card border border-line bg-parchment" />
        ))}
      </div>

      <p className="pt-2 text-center text-sm text-ink-soft">正在读取本机学习进度…</p>
    </div>
  );
}
