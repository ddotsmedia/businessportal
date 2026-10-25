import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/e2e/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/packages/db/**/__tests__/**',
    ],
    env: {
      DATABASE_URL: 'postgresql://portal:portal@localhost:5434/portal',
    },
  },
});
