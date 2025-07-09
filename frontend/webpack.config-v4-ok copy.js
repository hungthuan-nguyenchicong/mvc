const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './admin/src/app.js', // Entry point for your admin app
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, '../public/admin'), // Output to public/admin
            clean: true,
            publicPath: '/admin/',
        },
        module: {
            rules: [
                {
                    test: /\.(ico|png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext][query]',
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './admin/src/index.html',
                favicon: './admin/src/favicon.ico',
                // Đổi lại filename thành index.html cho dev server
                //filename: 'index.html', // Webpack dev server sẽ phục vụ index.html
                filename: 'admin.html',
                inject: 'body',
                scriptLoading: 'module',
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? 'style.[contenthash].css' : 'style.css',
            }),
        ],
        devServer: {
            hot: true,
            // Không cần static cho dev server nếu dùng proxy hoàn toàn cho PHP
            // Bỏ phần `static` nếu bạn chỉ muốn dev server phục vụ tài sản của webpack
            // và mọi thứ khác đều qua proxy.
            // Nếu bạn vẫn muốn phục vụ một số tài sản tĩnh từ public/admin, hãy giữ nó.
            // static: {
            //     directory: path.join(__dirname, '../public/admin'),
            //     publicPath: '/admin/',
            // },
            compress: true,
            port: 9000,
            open: {
                app: {
                    name: 'chrome',
                },
            },
            historyApiFallback: {
                rewrites: [
                    {
                        from: /^\/admin\/.*$/,
                        //to: '/admin/index.html', // Webpack dev server sẽ phục vụ index.html của nó
                        to: '/admin/admin.html', // Webpack dev server sẽ phục vụ index.html của nó
                    },
                ],
            },
            // *** SỬA LẠI PHẦN PROXY NÀY THÀNH MỘT MẢNG ***
            proxy: [ // Bắt đầu bằng dấu ngoặc vuông để tạo một mảng
                {
                    context: ['/admin/index.php', '/admin/api'], // Các đường dẫn mà bạn muốn proxy
                    target: 'http://localhost:8080', // Địa chỉ của server PHP của bạn
                    changeOrigin: true,
                    secure: false,
                    // rewrite: (path) => path.replace(/^\/admin/, ''), // Bỏ ghi chú nếu backend PHP của bạn không có tiền tố /admin
                },
                // Bạn có thể thêm các đối tượng proxy khác vào mảng nếu cần
                // {
                //     context: ['/another/php/route'],
                //     target: 'http://localhost:8080',
                //     changeOrigin: true,
                //     secure: false,
                // },
            ], // Kết thúc bằng dấu ngoặc vuông
        },
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};