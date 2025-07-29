// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';
import path from 'path'; // Import module path của Node.js để xử lý đường dẫn

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
    // removeEmptyAttributes: true, // Commented out in user's original, keeping it that way
};

export function htmlMinifyPlugin() {
    let ssrEntryAbsolutePath = ''; // Biến để lưu trữ đường dẫn tuyệt đối của SSR entry point

    return {
        name: 'html-minify-plugin',
        // Hook này được gọi sau khi cấu hình Vite đã được giải quyết hoàn chỉnh
        configResolved(config) {
            // Kiểm tra nếu build.ssr được định nghĩa và là một chuỗi
            if (config.build && config.build.ssr && typeof config.build.ssr === 'string') {
                // Chuyển đường dẫn tương đối của build.ssr thành đường dẫn tuyệt đối
                // `config.root` là thư mục gốc của dự án Vite
                ssrEntryAbsolutePath = path.resolve(config.root, config.build.ssr);
            }
        },
        // Hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ áp dụng plugin nếu:
            // 1. ssrEntryAbsolutePath đã được xác định (tức là build.ssr có giá trị)
            // 2. ID của module hiện tại (id) khớp chính xác với đường dẫn tuyệt đối của SSR entry point
            if (ssrEntryAbsolutePath && id === ssrEntryAbsolutePath) {
                let modifiedCode = code;

                // Regex để tìm các template literals được đánh dấu là /* html */`...`
                // LƯU Ý QUAN TRỌNG: Regex này là đơn giản và có thể không hoạt động hoàn hảo
                // với mọi trường hợp. Nó chỉ hiệu quả nếu HTML của bạn là một chuỗi literal
                // và không có các biểu thức JS phức tạp bên trong template literal
                const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;
                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const fullMatch = match[0]; // Toàn bộ phần /* html */`...`
                    const htmlContent = match[1]; // Nội dung bên trong backticks

                    try {
                        // ĐÃ SỬA LỖI: Sử dụng await htmlMinifier() thay vì htmlMinifier.sync()
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);

                        // Thay thế chuỗi HTML gốc bằng chuỗi đã minify, giữ nguyên /* html */``
                        // Đảm bảo escape các ký tự đặc biệt trong chuỗi để RegEx không bị lỗi
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `/* html */\`${minifiedHtml}\``);
                    } catch (e) {
                        // Sử dụng this.warn để báo cáo lỗi trong quá trình build của Vite
                        this.warn(`Failed to minify HTML string in ${id}: ${e.message}`);
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
