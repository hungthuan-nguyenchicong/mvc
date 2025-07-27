// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    //root: '.',
    build: {
        outDir: 'dist/server',
        emptyOutDir: true,        // Xóa thư mục đầu ra trước khi build
        ssr: 'backend/admin/views/login/login-page.js',
        minify: 'terser',
        //external: ['html-minifier-terser'],
        //minify: true
        rollupOptions: {
        input: {
            // Define the server entry point (matched to the ssr option)
            'login-page-ssr-bundle': 'backend/admin/views/login/login-page.js',
        },
        output: {
            //minify: 'terser',
            //format: 'cjs',           // Output as CommonJS for Node.js/Bun server
            // The output file name will be 'login-page-ssr-bundle.js'
            entryFileNames: '[name].js',
        },
        // Keep externalizing html-minifier-terser
        external: ['html-minifier-terser'],
        },
    },
    // ssr: {
    //     // Chỉ định module SSR
    //     target: 'node',
    //     format: 'esm',
    // },
})