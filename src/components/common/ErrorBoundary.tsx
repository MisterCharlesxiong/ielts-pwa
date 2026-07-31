import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * 顶层错误兜底。
 * 单页离线应用没有服务端可回退，崩溃后必须给出「重新加载」出口，
 * 否则用户只能手动关掉 PWA。
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, message: '' };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[app] 渲染异常', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleBackHome = (): void => {
    window.location.hash = '#/';
    window.location.reload();
  };

  public render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex min-h-dvh max-w-app flex-col items-center justify-center gap-4 bg-paper px-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-light text-moss-dark">!</span>
        <p className="text-lg font-semibold text-ink">页面出了点小问题</p>
        <p className="text-sm leading-relaxed text-ink-soft">
          你的学习进度已保存在本机，不会丢失。可以尝试重新加载。
        </p>
        {this.state.message ? (
          <p className="max-w-full break-all rounded-lg bg-moss-light px-3 py-2 text-xs text-ink-soft">
            {this.state.message}
          </p>
        ) : null}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={this.handleReload}
            className="min-h-tap rounded-card bg-moss px-5 text-paper active:bg-moss-dark"
          >
            重新加载
          </button>
          <button
            type="button"
            onClick={this.handleBackHome}
            className="min-h-tap rounded-card border border-line px-5 text-ink active:bg-moss-light"
          >
            回到首页
          </button>
        </div>
      </div>
    );
  }
}
