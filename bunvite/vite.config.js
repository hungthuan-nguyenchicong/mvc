// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    // Không cần plugin React hay Vue nữa
    plugins: [],
    build: {
        ssr: './src/entry-server.js', // Chỉ định entry point cho SSR build
        rollupOptions: {
            input: {
                client: './src/entry-client.js',
                server: './src/entry-server.js'
            }
        }
    }
});