// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173, // Đảm bảo cổng này
    strictPort: true,
  },
  base: '/',

  build: {
    ssr: 'src/entry-server.js',
    rollupOptions: {
      input: {
        client: 'src/main.js',
        server: 'src/entry-server.js',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'client') return `assets/main.js`;
          if (chunkInfo.name === 'server') return `server/entry-server.js`;
          return `assets/[name].js`;
        },
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
});