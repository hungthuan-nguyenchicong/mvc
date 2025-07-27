// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js'; // Import plugin

export default defineConfig({
    root: '.',
    plugins: [htmlMinifyPlugin()], // THÊM PLUGIN VÀO ĐÂY
    build: {
        outDir: 'dist/server',
        emptyOutDir: true,
        ssr: 'backend/admin/views/login/login-page.js', // Giữ nguyên điểm vào SSR
        minify: 'terser', // Vẫn minify JS code của bundle
        //minify: true,
        rollupOptions: {
            input: {
                'login-page-ssr-bundle': 'backend/admin/views/login/login-page.js',
            },
            output: {
                //format: 'cjs',
                entryFileNames: '[name].js',
            },
            // Không cần externalize html-minifier-terser nữa nếu nó chỉ dùng trong plugin
            // và không được import vào runtime bundle.
            // Tuy nhiên, để an toàn, vẫn có thể giữ lại externalize.
            //external: ['html-minifier-terser'],
            // Externalize terser nếu bạn dùng nó trong getFunctionBodyString
            //external: ['html-minifier-terser', 'terser'],
            //external: [],
        },
    },
});