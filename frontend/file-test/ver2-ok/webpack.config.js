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