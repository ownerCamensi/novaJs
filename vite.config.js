import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/novajs.js'),
      name: 'Nova',
      formats: ['umd', 'es'],
      fileName: (format) => format === 'umd' ? 'novajs.bundle.js' : 'novajs.es.js',
    },
    rollupOptions: {
      output: {
        name: 'Nova',
        exports: 'named',
      },
    },
    outDir: 'dist',
  },
  server: {
    open: '/index.html',
  },
});
