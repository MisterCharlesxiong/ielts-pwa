import { useEffect, useState } from 'react';

import { load } from '@/lib/contentLoader';
import type { AsyncState, ContentPackOf, LevelId, ModuleId } from '@/types';

/**
 * 加载内容包，统一返回 { data, loading, error } 三态。
 * 页面据此渲染 骨架 / 内容 / EmptyState。
 */
export function useContent<M extends ModuleId>(
  level: LevelId | null | undefined,
  module: M,
): AsyncState<ContentPackOf<M>> {
  const [state, setState] = useState<AsyncState<ContentPackOf<M>>>({
    data: null,
    loading: Boolean(level),
    error: null,
  });

  useEffect(() => {
    if (!level) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }

    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    load(level, module)
      .then((pack) => {
        if (cancelled) return;
        if (pack.items.length === 0) {
          setState({ data: pack, loading: false, error: '内容包为空或校验未通过' });
          return;
        }
        setState({ data: pack, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ data: null, loading: false, error: String(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [level, module]);

  return state;
}
