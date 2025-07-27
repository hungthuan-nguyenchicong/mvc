## học nhiều điểm vào

Rất tiếc, với cách viết plugin Vite hiện tại của bạn, bạn **không thể trực tiếp truyền dynamic `ssr.entry` points** (các điểm vào SSR động) thông qua cấu hình Vite một cách tự động để plugin của bạn phát hiện và xử lý.

-----

### Tại sao không?

Plugin của bạn hiện đang hoạt động dựa trên một quy tắc cứng nhắc:

```javascript
if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
    // ... logic xử lý ...
}
```

  * **`id` là đường dẫn tuyệt đối của file:** Trong hook `transform`, `id` là đường dẫn file mà Vite đang xử lý.
  * **Quy tắc tĩnh:** Điều kiện `id.includes('backend/admin/views/login/')` là một quy tắc tĩnh, cố định. Nó chỉ khớp với các file nằm trong một thư mục cụ thể và có đuôi `.js` hoặc `.ts`.

Khi bạn thay đổi `ssr.entry` trong cấu hình Vite của mình, điều đó chỉ định **Vite nên bắt đầu quá trình build SSR từ file nào**. Nó không tự động thay đổi cách plugin của bạn phát hiện và xử lý các file khác nhau dựa trên đường dẫn đó. Plugin của bạn vẫn sẽ duyệt qua tất cả các file và áp dụng logic của nó chỉ khi `id` khớp với quy tắc tĩnh bạn đã đặt.

-----

### Các cách để xử lý SSR Entry Points động

Nếu bạn muốn plugin của mình linh hoạt hơn với các `ssr.entry` points động, bạn sẽ cần một phương pháp khác:

#### 1\. Cấu hình plugin động (Đề xuất)

Thay vì hardcode đường dẫn trong plugin, bạn có thể truyền các đường dẫn hoặc quy tắc khớp động khi bạn khởi tạo plugin trong `vite.config.js` của mình.

**`vite-html-minify-plugin.js` (Sửa đổi để chấp nhận options):**

```javascript
// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';

const defaultMinifyOptions = {
    // ... (các tùy chọn minify của bạn)
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

export function htmlMinifyPlugin(options = {}) {
    const { include = [] } = options; // Mảng các chuỗi hoặc regex để kiểm tra 'id'

    // Chuẩn hóa include thành một mảng các regex
    const includeMatchers = include.map(pattern => {
        if (pattern instanceof RegExp) {
            return pattern;
        }
        // Biến chuỗi thành regex, thoát ký tự đặc biệt và cho phép khớp một phần
        return new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    });

    return {
        name: 'html-minify-plugin',
        async transform(code, id) {
            // Kiểm tra xem 'id' có khớp với bất kỳ pattern nào trong 'include' không
            const shouldProcess = includeMatchers.some(matcher => matcher.test(id));

            if (shouldProcess && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;
                const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*)(`)([\s\S]*?)(`)/g; // Sử dụng regex với 4 nhóm bắt giữ để linh hoạt hơn
                const matches = [...code.matchAll(htmlTemplateRegex)];

                // console.log(`Processing file: ${id}`);
                // console.log(`Found ${matches.length} HTML template matches.`);

                for (const match of matches) {
                    const fullMatch = match[0];
                    const prefix = match[1];
                    const openBacktick = match[2];
                    const htmlContent = match[3];
                    const closeBacktick = match[4];

                    // console.log('--- Original HTML Content being processed by html-minifier-terser ---');
                    // console.log(htmlContent);
                    // console.log('--------------------------------------------------------------------');

                    try {
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
```

**`vite.config.js` (Sử dụng plugin đã sửa đổi):**

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js'; // Đường dẫn đến plugin của bạn

export default defineConfig({
    plugins: [
        htmlMinifyPlugin({
            // Truyền các đường dẫn hoặc regex để plugin biết file nào cần xử lý
            include: [
                'backend/admin/views/login/', // Sẽ khớp với các file trong thư mục này
                'backend/other/some-other-template.js', // Một file cụ thể
                /backend\/users\/.+\.js$/, // Regex để khớp tất cả các file JS trong thư mục users
                // Bạn có thể thêm bất kỳ đường dẫn hoặc regex nào khác tùy thuộc vào entry points của bạn
            ]
        })
    ],
    build: {
        ssr: './backend/admin/views/login/login-page.js', // SSR entry point của bạn
        // ... các tùy chọn build khác
    }
});
```

Với cách này, khi bạn thay đổi `ssr.entry`, bạn cũng có thể cập nhật danh sách `include` trong cấu hình plugin để đảm bảo file đó được xử lý.

#### 2\. Dựa vào `configResolved` hook (Nâng cao hơn)

Nếu bạn muốn plugin tự động suy luận các entry points mà không cần cấu hình lại trong `vite.config.js`, bạn có thể sử dụng hook `configResolved` để truy cập cấu hình Vite cuối cùng, bao gồm cả `build.ssr`.

```javascript
// vite-html-minify-plugin.js
// ... (các import và defaultMinifyOptions giữ nguyên)

export function htmlMinifyPlugin() {
    let ssrEntryPaths = [];

    return {
        name: 'html-minify-plugin',
        // Hook này được gọi sau khi Vite giải quyết tất cả cấu hình
        configResolved(config) {
            if (config.build && config.build.ssr) {
                // Lấy đường dẫn SSR entry point. Có thể là chuỗi hoặc mảng.
                const ssrEntries = Array.isArray(config.build.ssr) ? config.build.ssr : [config.build.ssr];
                // Chuyển đổi đường dẫn tương đối thành tuyệt đối nếu cần
                ssrEntryPaths = ssrEntries.map(entry => path.resolve(config.root, entry));
            }
        },
        async transform(code, id) {
            // Kiểm tra xem ID có phải là một trong các SSR entry point không
            const isSsrEntryPoint = ssrEntryPaths.includes(id);

            // Hoặc nếu bạn muốn xử lý tất cả các file mà SSR entry point có thể import:
            // Bạn cần một cách phức tạp hơn để theo dõi các imports từ entry point
            // Đây là một ví dụ đơn giản CHỈ xử lý chính entry point và các file trong thư mục 'login'
            // Để bao gồm tất cả các imports, bạn sẽ cần dùng đến `resolveId` và `load` hook
            // hoặc phân tích AST của entry point.
            if (isSsrEntryPoint || (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts')))) {
                // ... (logic xử lý HTML minify giống như trên)
                // Đảm bảo bạn sử dụng regex 4 nhóm bắt giữ đã được cung cấp
                // ...
            }
            return null;
        }
    };
}
```

**Lưu ý:** Cách thứ 2 này phức tạp hơn vì nó chỉ kiểm tra chính SSR entry point. Để plugin xử lý *tất cả các file được import* bởi SSR entry point (nơi các template literal có thể nằm), bạn cần một logic phức tạp hơn bằng cách theo dõi cây dependency hoặc xử lý một phạm vi file rộng hơn.

-----

### Kết luận

Để plugin của bạn xử lý các file khác khi bạn thay đổi `ssr.entry` point, bạn nên sử dụng **Option 1**: làm cho plugin của bạn nhận các tùy chọn `include` hoặc `exclude` trong quá trình khởi tạo trong `vite.config.js`. Điều này cung cấp sự linh hoạt cần thiết mà không làm phức tạp quá mức logic của plugin.