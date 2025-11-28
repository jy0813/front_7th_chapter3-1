import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
import { defineConfig as defineTestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineViteConfig(({ mode }) => {
  const viteConfig = defineViteConfig({
    // 여기서 mode 사용 가능
    base: mode === 'production' ? '/front_7th_chapter3-1/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });

  const testConfig = defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  });

  // 두 설정을 병합하여 반환
  return mergeConfig(viteConfig, testConfig);
});
