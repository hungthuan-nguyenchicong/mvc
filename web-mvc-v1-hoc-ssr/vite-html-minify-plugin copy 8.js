// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';

const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true, // Cái này sẽ xóa bình luận HTML, và bình luận JS/CSS nếu chúng còn tồn tại
    minifyCSS: true,
    minifyJS: {
        compress: true, // Terser sẽ nén JS và xóa bình luận JS
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
    //removeEmptyAttributes: true, // Đã comment out trong mã của bạn, giữ nguyên
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin',
        async transform(code, id) {
            if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;

                // Regex với 4 nhóm bắt giữ rõ ràng để tách tiền tố, backtick mở, nội dung và backtick đóng
                // Điều này giúp xây dựng lại chuỗi chính xác hơn
                const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*)(`)([\s\S]*?)(`)/g;

                const matches = [...code.matchAll(htmlTemplateRegex)];

                console.log(`Processing file: ${id}`);
                console.log(`Found ${matches.length} HTML template matches.`);

                for (const match of matches) {
                    const fullMatch = match[0];              // Toàn bộ chuỗi khớp (ví dụ: /* html */`...`)
                    const prefix = match[1];                  // `/* html */ ` (hoặc `/* html */` nếu không có khoảng trắng)
                    const openBacktick = match[2];            // `` ` ``
                    const htmlContent = match[3];             // Nội dung HTML bên trong backtick (đã được getFunctionBodyString xử lý)
                    const closeBacktick = match[4];           // `` ` ``

                    console.log('--- Original HTML Content being processed by html-minifier-terser ---');
                    console.log(htmlContent); // Đây là nội dung mà html-minifier-terser sẽ nhận
                    console.log('--------------------------------------------------------------------');

                    try {
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);

                        // Escape fullMatch để nó có thể được sử dụng làm mẫu trong RegExp
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        // Thay thế toàn bộ chuỗi khớp gốc bằng chuỗi đã được minify
                        // Sử dụng các nhóm bắt giữ để xây dựng lại chuỗi
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