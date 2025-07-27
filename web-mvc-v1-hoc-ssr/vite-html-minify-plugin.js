// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';
//import { minify as terserMinify } from 'terser'; // Import Terser

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
    //removeEmptyAttributes: true,
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin', // Tên plugin
        // hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ áp dụng cho các file mà bạn muốn minify HTML
            // Điều chỉnh đường dẫn regex cho phù hợp với cấu trúc project của bạn
            if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;

                // Regex để tìm các template literals được đánh dấu là /* html */`...`
                // Đây là một cách đơn giản, có thể cần phức tạp hơn cho các trường hợp phức tạp
                const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;
                //const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*`)([\s\S]*?)(`)/g; // Regex ban đầu của bạn.
                //const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*)(`)([\s\S]*?)(`)/g;
                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const fullMatch = match[0]; // Toàn bộ phần /* html */`...`
                    const htmlContent = match[1]; // Nội dung bên trong backticks
            // const fullMatch = match[0];
            // const prefix = match[1];
            // const htmlContent = match[2]; // Đây là nội dung HTML mà html-minifier-terser sẽ nhận
            // const suffix = match[3];

            // console.log('--- Original HTML Content being processed ---');
            // console.log(htmlContent); // LOG NỘI DUNG NÀY ĐỂ KIỂM TRA
            // console.log('-------------------------------------------');
                    try {
                        // Minify nội dung HTML
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);
                        // Thay thế chuỗi HTML gốc bằng chuỗi đã minify, giữ nguyên /* html */``
                        // Đảm bảo escape các ký tự đặc biệt trong chuỗi để RegEx không bị lỗi
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `/* html */\`${minifiedHtml}\``);
                    } catch (e) {
                        this.warn(`Failed to minify HTML in ${id}: ${e.message}`);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null // hoặc tạo sourcemap nếu cần
                };
            }
            return null; // Trả về null nếu không muốn xử lý file này
        }
    };
}