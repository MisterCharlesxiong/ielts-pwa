import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from '@/App';
import { markNeedRefresh, setUpdateSW } from '@/lib/pwaUpdate';
import '@/styles/index.css';

/**
 * 注册 Service Worker。
 * registerType 为 autoUpdate，但这里**不自动 reload**：把更新函数交给 pwaUpdate 协调器，
 * 由 App.tsx 在非作答场景弹 Toast，用户点击后才刷新。
 */
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    markNeedRefresh();
  },
  onRegisterError(error: unknown) {
    console.warn('[pwa] Service Worker 注册失败，应用仍可正常使用', error);
  },
});
setUpdateSW(updateSW);

const container = document.getElementById('root');
if (!container) {
  throw new Error('找不到 #root 挂载点，index.html 可能被破坏');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
