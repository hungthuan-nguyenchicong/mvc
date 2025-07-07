const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => { // Truyền env và argv để xác định mode
    const isProduction = argv.mode === 'production'; // Xác định chế độ production

    return {
        // Nếu bạn muốn điều khiển mode bằng lệnh CLI (e.g., webpack --mode development)
        // thì không cần dòng `mode` ở đây.
        // mode: 'development', // Bỏ comment nếu bạn muốn cố định mode

        entry: './admin/src/app.js',
        output: {
            filename: 'bundle.[contenthash].js',
            // Đặt tất cả các tệp đầu ra vào thư mục 'public'
            path: path.resolve(__dirname, '../public/admin/api'),
            clean: true, // Thêm clean: true để làm sạch thư mục đầu ra mỗi khi build
            // Đảm bảo rằng tất cả các tài sản (assets) được tham chiếu từ gốc của miền.
            // Ví dụ: <script src="/bundle.[contenthash].js"></script> thay vì <script src="bundle.[contenthash].js"></script>
            //publicPath: '/', // Đường dẫn gốc cho các tài sản từ thư mục output
            publicPath: '/admin/api/',
        },
        module: {
            rules: [
                {
                    test: /\.(ico|png|jpg|jpeg|gif|svg)$/i, // Áp dụng cho các loại tệp hình ảnh
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext][query]', // Tùy chỉnh tên tệp đầu ra (ví dụ: images/favicon.ico)
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Sử dụng MiniCssExtractPlugin.loader trong production để trích xuất CSS
                        // Sử dụng style-loader trong development để hot-reloading
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
                },
                // Thêm quy tắc riêng cho CSS thuần nếu bạn có các tệp .css
                {
                    test: /\.css$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
                // Thêm các quy tắc khác nếu bạn có (ví dụ: babel-loader cho JS, file-loader cho hình ảnh)
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './admin/src/index.html', // Path to your source HTML template
                favicon: './admin/src/favicon.ico',
                filename: 'index.html', // Output filename in your build directory
                inject: 'body', // Chèn scripts vào cuối <body>
                scriptLoading: 'module',
            }),
            new MiniCssExtractPlugin({
                // Đặt tên tệp CSS đầu ra
                // Sử dụng [contenthash] trong production để caching hiệu quả hơn
                filename: isProduction ? 'style.[contenthash].css' : 'style.css',
                // chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css', // cho các chunk CSS không phải từ entry
            }),
        ],
        devServer: {
            hot: true, // Enable HMR
            // *** THÊM DÒNG NÀY ĐỂ VÔ HIỆU HÓA CACHE TRÌNH DUYỆT ***
            // headers: {
            //     'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            //     'Pragma': 'no-cache',
            //     'Expires': '0',
            // },
            // Phục vụ các tệp tĩnh từ thư mục 'public'
            // Đảm bảo publicPath của devServer khớp với publicPath của output nếu bạn muốn truy cập assets trực tiếp
            static: {
                directory: path.join(__dirname, '../public'), // Dev server sẽ phục vụ từ thư mục public
                publicPath: '/', // Public path cho dev server
            },
            compress: true, // Bật nén Gzip cho tất cả nội dung được phục vụ
            port: 9000, // Cổng để chạy dev server
            open: { // Tự động mở trình duyệt khi dev server khởi động
                app: {
                    name: 'chrome', // Mở bằng Chrome
                },
            },
            // Quan trọng cho SPA: chuyển hướng tất cả các yêu cầu không phải tệp tĩnh về index.html
            historyApiFallback: true,
        },
        // Đặt mode ở đây nếu bạn không muốn truyền nó qua CLI
        mode: isProduction ? 'production' : 'development',
        // Tạo source maps để dễ debug
        //devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};