import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'next', 'zod'],
  esbuildOptions(options) {
    options.legalComments = 'inline';
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': '"production"'
    };
  }
});