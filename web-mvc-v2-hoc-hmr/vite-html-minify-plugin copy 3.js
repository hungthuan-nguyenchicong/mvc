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
};

export function htmlMinifyPlugin() {
    // Thay đổi thành mảng để lưu trữ nhiều đường dẫn tuyệt đối của SSR entry points
    let ssrEntryAbsolutePaths = [];

    return {
        name: 'html-minify-plugin',
        // Hook này được gọi sau khi cấu hình Vite đã được giải quyết hoàn chỉnh
        configResolved(config) {
            const root = config.root; // Thư mục gốc của dự án

            // Trường hợp 1: build.ssr là một chuỗi (single SSR entry)
            if (typeof config.build.ssr === 'string') {
                ssrEntryAbsolutePaths.push(path.resolve(root, config.build.ssr));
            }
            // Trường hợp 2: build.ssr là true (Vite tự động suy ra entry từ rollupOptions.input)
            // Hoặc build.ssr là một mảng các entry points (ít phổ biến hơn, nhưng có thể)
            else if (config.build.ssr === true || Array.isArray(config.build.ssr)) {
                // Lấy input từ rollupOptions
                const rollupInput = config.build.rollupOptions?.input;

                if (rollupInput) {
                    if (typeof rollupInput === 'string') {
                        // Nếu input là một chuỗi
                        ssrEntryAbsolutePaths.push(path.resolve(root, rollupInput));
                    } else if (Array.isArray(rollupInput)) {
                        // Nếu input là một mảng
                        rollupInput.forEach(entry => {
                            if (typeof entry === 'string') {
                                ssrEntryAbsolutePaths.push(path.resolve(root, entry));
                            }
                        });
                    } else if (typeof rollupInput === 'object') {
                        // Nếu input là một đối tượng (ví dụ: { main: './src/main.js', admin: './src/admin.js' })
                        for (const key in rollupInput) {
                            if (typeof rollupInput[key] === 'string') {
                                ssrEntryAbsolutePaths.push(path.resolve(root, rollupInput[key]));
                            }
                        }
                    }
                }
            }
            // Loại bỏ các đường dẫn trùng lặp nếu có
            ssrEntryAbsolutePaths = [...new Set(ssrEntryAbsolutePaths)];
            // console.log('Resolved SSR Entry Paths:', ssrEntryAbsolutePaths); // Để gỡ lỗi
        },
        // Hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ áp dụng plugin nếu ID của module hiện tại nằm trong danh sách các SSR entry points đã giải quyết
            if (ssrEntryAbsolutePaths.includes(id)) {
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
                        // Minify nội dung HTML
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
