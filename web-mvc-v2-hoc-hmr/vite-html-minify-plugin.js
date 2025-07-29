// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';
import path from 'path'; // Import module path của Node.js để xử lý đường dẫn

const defaultMinifyOptions = {
    collapseWhitespace: true, // Loại bỏ khoảng trắng thừa
    removeComments: true,     // Loại bỏ bình luận
    minifyCSS: true,          // Nén CSS nội tuyến
    minifyJS: {               // Tùy chọn nén JS nội tuyến
        compress: true,       // Bật nén
        mangle: true,         // Bật làm biến tên
    },
    sortAttributes: true,     // Sắp xếp các thuộc tính HTML
    sortClassName: true,      // Sắp xếp các lớp CSS
    collapseBooleanAttributes: true, // Rút gọn các thuộc tính boolean
    collapseInlineTagWhitespace: true, // Rút gọn khoảng trắng trong thẻ nội tuyến
    conservativeCollapse: false, // Không thu gọn một cách bảo thủ
    decodeEntities: true,     // Giải mã các thực thể HTML
    html5: true,              // Sử dụng quy tắc HTML5
    keepClosingSlash: false,  // Không giữ dấu gạch chéo đóng
    removeTagWhitespace: true, // Loại bỏ khoảng trắng quanh các thẻ
    removeRedundantAttributes: true, // Loại bỏ các thuộc tính dư thừa
    removeScriptTypeAttributes: true, // Loại bỏ thuộc tính type="text/javascript"
    removeStyleLinkTypeAttributes: true, // Loại bỏ thuộc tính type="text/css"
    useShortDoctype: true,    // Sử dụng doctype ngắn
    trimCustomFragments: true, // Cắt khoảng trắng từ các fragment tùy chỉnh
    processConditionalComments: true, // Xử lý các bình luận điều kiện (IE)
};

export function htmlMinifyPlugin() {
    let isSsrBuild = false; // Cờ để kiểm tra xem đây có phải là bản build SSR không

    return {
        name: 'html-minify-plugin',
        // Hook này được gọi sau khi cấu hình Vite đã được giải quyết hoàn chỉnh
        configResolved(config) {
            // Kiểm tra xem đây có phải là bản build SSR không.
            // config.build.ssr sẽ là true hoặc một chuỗi/đối tượng cho các bản build SSR.
            isSsrBuild = !!config.build.ssr;
            // console.log('Is SSR Build:', isSsrBuild); // Để gỡ lỗi
        },
        // Hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ áp dụng plugin nếu đây là bản build SSR VÀ file là một file JS/TS
            if (!isSsrBuild || !/\.(js|jsx|ts|tsx)$/.test(id)) {
                return null; // Không phải bản build SSR hoặc không phải file JS/TS, bỏ qua
            }

            let modifiedCode = code;

            // Regex để tìm các template literals được đánh dấu là /* html */`...`
            // Regex này được thiết kế để bắt nội dung bên trong dấu backticks.
            // Điều quan trọng cần lưu ý là nó sẽ minify phần *tĩnh* của template literal.
            // Các phần động như ${hmr} sẽ vẫn là các biểu thức JS.
            const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;
            const matches = [...code.matchAll(htmlTemplateRegex)];

            if (matches.length === 0) {
                return null; // Không tìm thấy template HTML nào trong module này, bỏ qua
            }

            for (const match of matches) {
                const fullMatch = match[0]; // Toàn bộ phần /* html */`...`
                const htmlContent = match[1]; // Nội dung bên trong backticks

                try {
                    // Minify nội dung HTML
                    const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);

                    // Thay thế chuỗi HTML gốc bằng chuỗi đã minify, giữ nguyên /* html */``
                    // Cần escape các ký tự đặc biệt trong fullMatch cho constructor RegExp
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
    };
}
