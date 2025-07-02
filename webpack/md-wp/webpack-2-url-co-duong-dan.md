## có duong dan product/123

Bạn đang gặp lỗi GET http://localhost:9000/products/bundle.cc78d1621d8cf3801669.js net::ERR_ABORTED 404 (Not Found) khi truy cập http://localhost:9000/products/789.

Lỗi này xảy ra vì trình duyệt đang cố gắng tải tệp bundle.js từ một đường dẫn không chính xác (/products/bundle.js) thay vì từ thư mục gốc của máy chủ (/bundle.js).

Hãy cùng phân tích webpack.config.js của bạn và nguyên nhân của lỗi:

Phân tích webpack.config.js
output.path: path.resolve(__dirname, 'public'):

Điều này có nghĩa là tất cả các tệp đầu ra của Webpack (bao gồm bundle.[contenthash].js và index.html được tạo bởi HtmlWebpackPlugin) sẽ được đặt vào thư mục public trong dự án của bạn.

Vậy, sau khi build, bạn sẽ có cấu trúc:

your-project/
├── public/
│   ├── index.html
│   └── bundle.[contenthash].js
└── src/
    └── index.js
└── index.html (template)
└── webpack.config.js
devServer.static: { directory: path.join(__dirname, 'public') }:

Cấu hình này nói với Webpack Dev Server rằng nó nên phục vụ các tệp tĩnh từ thư mục public.

Điều này có nghĩa là khi trình duyệt yêu cầu /bundle.js, dev server sẽ tìm tệp đó trong public/bundle.js. Khi yêu cầu /, dev server sẽ tìm public/index.html.

devServer.historyApiFallback: true:

Đây là cài đặt rất quan trọng cho các ứng dụng Single Page Application (SPA).

Nếu trình duyệt yêu cầu một URL (ví dụ: /products/789) mà không phải là một tệp tĩnh có sẵn trên máy chủ, historyApiFallback sẽ đảm bảo rằng máy chủ trả về tệp index.html của bạn thay vì lỗi 404. Điều này cho phép router JavaScript phía client của bạn xử lý đường dẫn.

Nguyên nhân của lỗi 404 (Not Found) cho bundle.js
Khi bạn truy cập trực tiếp http://localhost:9000/products/789 (hoặc làm mới trang tại URL này):

Yêu cầu ban đầu: Trình duyệt gửi yêu cầu GET tới http://localhost:9000/products/789.

historyApiFallback hoạt động: Vì /products/789 không phải là một tệp tĩnh, Webpack Dev Server (nhờ historyApiFallback: true) sẽ trả về tệp public/index.html.

Trình duyệt đọc index.html: Trình duyệt nhận được index.html và bắt đầu phân tích cú pháp. Trong tệp index.html được tạo bởi HtmlWebpackPlugin, có một thẻ <script> để tải tệp JavaScript bundle của bạn.

Vấn đề: Mặc định, HtmlWebpackPlugin (và Webpack output) sẽ tạo đường dẫn tương đối cho tệp bundle trong thẻ <script>. Nếu bạn không cấu hình output.publicPath, thẻ <script> có thể trông như thế này: <script src="bundle.cc78d1621d8cf3801669.js"></script>.

Yêu cầu tệp bundle.js: Khi trình duyệt nhìn thấy thẻ <script src="bundle.cc78d1621d8cf3801669.js"></script> và URL hiện tại của nó là http://localhost:9000/products/789, nó sẽ cố gắng giải quyết đường dẫn tương đối này dựa trên URL hiện tại.

Nó sẽ tạo ra yêu cầu: http://localhost:9000/products/bundle.cc78d1621d8cf3801669.js.

Máy chủ không tìm thấy: Máy chủ của bạn (Webpack Dev Server) được cấu hình để phục vụ các tệp tĩnh từ thư mục public. Nó tìm kiếm public/products/bundle.cc78d1621d8cf3801669.js, nhưng tệp bundle.js thực tế nằm ở public/bundle.cc78d1621d8cf3801669.js. Do đó, nó trả về lỗi 404 Not Found.

Cách khắc phục: Sử dụng output.publicPath
Để khắc phục lỗi này, bạn cần nói cho Webpack biết đường dẫn công khai (public URL path) mà các tài sản của bạn sẽ được phục vụ. Điều này sẽ đảm bảo rằng thẻ <script> trong index.html luôn sử dụng một đường dẫn tuyệt đối từ gốc của miền.

Bạn cần thêm publicPath: '/' vào cấu hình output của Webpack.

webpack.config.js đã sửa đổi
JavaScript

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[contenthash].js',
        // Đặt tất cả các tệp đầu ra vào thư mục 'public'
        path: path.resolve(__dirname, 'public'),
        clean: true,
        // *** THÊM DÒNG NÀY ***
        // Đảm bảo rằng tất cả các tài sản (assets) được tham chiếu từ gốc của miền.
        // Ví dụ: <script src="/bundle.[contenthash].js"></script> thay vì <script src="bundle.[contenthash].js"></script>
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            // Thêm các quy tắc khác nếu bạn có (ví dụ: babel-loader cho JS, file-loader cho hình ảnh)
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack App',
            template: './index.html', // Đường dẫn đến tệp HTML mẫu của bạn
            scriptLoading: 'module', // Đảm bảo script được tải dưới dạng module
        }),
    ],
    devServer: {
        // Phục vụ các tệp tĩnh từ thư mục 'public'
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true, // Bật nén Gzip cho tất cả nội dung được phục vụ
        port: 9000,     // Cổng để chạy dev server
        open: {         // Tự động mở trình duyệt khi dev server khởi động
            app: {
                name: 'chrome', // Mở bằng Chrome
            },
        },
        // Quan trọng cho SPA: chuyển hướng tất cả các yêu cầu không phải tệp tĩnh về index.html
        historyApiFallback: true,
    }
};
Sau khi thêm publicPath: '/' vào cấu hình output và chạy lại Webpack Dev Server, trình duyệt sẽ yêu cầu http://localhost:9000/bundle.cc78d1621d8cf3801669.js (đường dẫn tuyệt đối từ gốc), và máy chủ sẽ tìm thấy tệp đó trong thư mục public của bạn, giải quyết được lỗi 404.