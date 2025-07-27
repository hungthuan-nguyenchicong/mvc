// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';

const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: {
        compress: true,
        mangle: true,
    },
    sortAttributes: true,
    sortClassName: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: false,
    decodeEntities: true,
    html5: true,
    keepClosingSlash: false,
    removeTagWhitespace: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    trimCustomFragments: true,
    processConditionalComments: true,
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin',
        async transform(code, id) {
            if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;

                // Regex mới với các nhóm bắt giữ rõ ràng:
                // Nhóm 1: `/* html */` và khoảng trắng theo sau
                // Nhóm 2: Dấu backtick mở (`)
                // Nhóm 3: Nội dung HTML ([\s\S]*?)
                // Nhóm 4: Dấu backtick đóng (`)
                const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*)(`)([\s\S]*?)(`)/g;

                const matches = [...code.matchAll(htmlTemplateRegex)];

                // Console log này sẽ giúp bạn thấy số lượng khớp tìm được
                console.log(`Processing file: ${id}`);
                console.log(`Found ${matches.length} HTML template matches.`);

                for (const match of matches) {
                    const fullMatch = match[0];              // Toàn bộ chuỗi khớp
                    const prefix = match[1];                  // Ví dụ: `/* html */ `
                    const openBacktick = match[2];            // Ví dụ: `` ` ``
                    const htmlContent = match[3];             // Nội dung HTML bên trong backtick
                    const closeBacktick = match[4];           // Ví dụ: `` ` ``

                    console.log('--- Original HTML Content being processed ---');
                    console.log(htmlContent); // Kiểm tra xem nội dung này có bao gồm `<script>` không
                    console.log('-------------------------------------------');

                    try {
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);

                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        // Xây dựng lại chuỗi đã được thu nhỏ với các phần đã bắt được
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `${prefix}${openBacktick}${minifiedHtml}${closeBacktick}`);

                    } catch (e) {
                        this.error(`Failed to minify HTML in ${id}: ${e.message}. Using original HTML for this section.`, e.loc);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null
                };
            }
            return null;
        }
    };
}