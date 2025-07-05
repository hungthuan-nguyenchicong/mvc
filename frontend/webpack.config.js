const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.[contenthash].js',
        // Đặt tất cả các tệp đầu ra vào thư mục 'public'
        path: path.resolve(__dirname, 'public'),
        clean: true,
        // Đảm bảo các tài sản được tham chiếu từ gốc của tên miền
        // Ví dụ: <script src="/bundle.[contenthash].js"></script> thay vì <script src="bundle.[contenthash].js"></script>
        publicPath: '/',

    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            scriptLoading: 'module',
        }),

    ],
    devServer: {
        // Phục vụ các tệp tĩnh từ thư mục 'public'
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true, // Bật nén Gzip cho tất cả nội dung được phục vụ
        port: 9000,
        open: {
            app: {
                name: 'chrome', // Mở bằng Chrome
            },
        },
        // Quan trọn cho SPA: Chuyển tất cả các yêu cầu không phải tệp tĩnh về index.html
        historyApiFallback: true,
    }
}