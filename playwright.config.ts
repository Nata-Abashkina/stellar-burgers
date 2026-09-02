import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.ts',
  use: {
    baseURL: 'http://localhost:4000'
  }
});