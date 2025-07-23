// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],
    build: {
        minify: false,
        rollupOptions: {
            input: {
                client: './src/entry-client.js',
                server: './src/entry-server.js'
            }
        },
        outDir: 'dist/client', // Client build output
        ssr: 'dist/server', // SSR build output
    },
    optimizeDeps: {
        exclude: ['elysia']
    }
});