// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';

const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true, // Đảm bảo cái này là true để xóa bình luận HTML/CSS/JS
    minifyCSS: true,
    minifyJS: {
        compress: true, // Đảm bảo cái này là true để Terser nén và xóa bình luận JS
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
    //removeEmptyAttributes: true,
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin',
        async transform(code, id) {
            if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;

                // Regex với 4 nhóm bắt giữ rõ ràng:
                // Nhóm 1: `/* html */` và khoảng trắng tùy chọn theo sau.
                // Nhóm 2: Dấu backtick mở (`)
                // Nhóm 3: Nội dung HTML ([\s\S]*?) - Đây là phần sẽ được minify.
                // Nhóm 4: Dấu backtick đóng (`)
                const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*)(`)([\s\S]*?)(`)/g;

                const matches = [...code.matchAll(htmlTemplateRegex)];

                console.log(`Processing file: ${id}`);
                console.log(`Found ${matches.length} HTML template matches.`);

                for (const match of matches) {
                    const fullMatch = match[0];              // Toàn bộ chuỗi khớp (e.g., /* html */`...`)
                    const prefix = match[1];                  // `/* html */ ` (hoặc `/* html */` nếu không có khoảng trắng)
                    const openBacktick = match[2];            // `` ` ``
                    const htmlContent = match[3];             // Nội dung HTML bên trong backtick
                    const closeBacktick = match[4];           // `` ` ``

                    console.log('--- Original HTML Content being processed ---');
                    console.log(htmlContent); // Kiểm tra kỹ đầu ra này
                    console.log('-------------------------------------------');

                    try {
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);

                        // Escape fullMatch để nó có thể được sử dụng làm mẫu trong RegExp
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        // Thay thế toàn bộ chuỗi khớp gốc bằng chuỗi đã được minify
                        // Sử dụng các nhóm bắt giữ để xây dựng lại chuỗi
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `${prefix}${openBacktick}${minifiedHtml}${closeBacktick}`);

                    } catch (e) {
                        // Sử dụng this.error để Vite hiển thị lỗi rõ ràng hơn trong quá trình build
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