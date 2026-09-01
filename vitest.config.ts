import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['app/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Scope to exercised product surface so Codacy reflects real signal
      // (demo + contact/security utils), not zero-weight pages/assets.
      include: [
        'app/routes/projects.annotation-dashboard/dashboard/**/*.{ts,tsx}',
        'app/utils/**/*.{js,ts}',
      ],
      exclude: [
        'node_modules/',
        'build/',
        '.storybook/',
        '**/*.stories.*',
        '**/*.{test,spec}.{ts,tsx}',
        '**/__tests__/**',
      ],
    },
  },
});
