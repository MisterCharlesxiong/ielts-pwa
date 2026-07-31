import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Vite 配置。
 *
 * 【致命坑 #3】`base` 必须为 '/ielts-pwa/'，否则部署到 GitHub Pages 子路径后
 * index.html 里的资源引用会指向站点根，导致线上白屏。build 后请肉眼检查
 * dist/index.html 中所有 script/link 的路径都以 /ielts-pwa/ 开头。
 */
export default defineConfig({
  base: '/ielts-pwa/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      // 【致命坑 #5】autoUpdate 仅表示 SW 自动接管，不做自动 reload。
      // 刷新时机由 UI 层 Toast 交给用户手势决定（见 src/lib/pwaUpdate.ts）。
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        id: '/ielts-pwa/',
        name: '雅思 PWA 英语学习',
        short_name: '雅思PWA',
        description: '手机优先、护眼、可断点续学的离线雅思备考应用',
        lang: 'zh-CN',
        dir: 'ltr',
        start_url: '/ielts-pwa/',
        scope: '/ielts-pwa/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FDFBF7',
        theme_color: '#6B8E6B',
        categories: ['education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
