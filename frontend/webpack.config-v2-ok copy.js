const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'public'),
        clean: true,
        publicPath: '/',
    },
    resolve: {
        alias: {
            // Đảm bảo alias này được định nghĩa chính xác
            '@views': path.resolve(__dirname, './src/views'),
            '@core': path.resolve(__dirname, './src/core'),
            '@utils': path.resolve(__dirname, './src/utils'),
            // ... các alias khác (nếu có)
        },
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack SPA Router App',
            template: './index.html',
            scriptLoading: 'module',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        open: {
            app: {
                name: 'chrome',
            },
        },
        historyApiFallback: true,
    },
    mode: 'development',
};