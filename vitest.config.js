import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: "tests/setup.js",
    fileParallelism: false
  },
});