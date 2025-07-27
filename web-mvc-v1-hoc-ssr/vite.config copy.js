// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({

    build: {
        outDir: './dist/server',
        emptyOutDir: true,        // Xóa thư mục đầu ra trước khi build
        ssr: './backend/admin/views/login/login-page.js',
        //minify: 'terser',
        minify: true
    }
})