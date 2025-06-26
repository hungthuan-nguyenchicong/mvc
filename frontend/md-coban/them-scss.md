## Để sử dụng SCSS (Sass) trong dự án Webpack của bạn

npm install --save-dev sass-loader sass

Bước 2: Cập nhật webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // Chế độ phát triển (development) hoặc sản xuất (production)
  mode: 'development',

  // Điểm vào (entry point) của ứng dụng
  entry: './src/index.js',

  // Cấu hình đầu ra (output) của quá trình build
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  // Cấu hình module (loaders)
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // --- THÊM QUY TẮC NÀY CHO SCSS ---
      {
        test: /\.scss$/, // Áp dụng cho các file .scss
        use: [
          'style-loader',   // 3. Inject CSS vào DOM
          'css-loader',     // 2. Interpret @import, url()
          'sass-loader',    // 1. Biên dịch Sass/SCSS thành CSS
        ],
      },
      // --- KẾT THÚC THÊM QUY TẮC NÀY ---
      // Bạn có thể thêm các loader khác cho hình ảnh, font, v.v.
    ],
  },

  // Cấu hình plugins
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],

  // Cấu hình Dev Server
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    open: true,
    historyApiFallback: true,
  },

  // Cấu hình giải quyết module
  resolve: {
    extensions: ['.js', '.json', '.scss'], // Thêm .scss vào phần extensions để import không cần đuôi
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
};

## Giải thích quy tắc cho SCSS:

Giải thích quy tắc cho SCSS:

test: /\.scss$/: Webpack sẽ áp dụng loader này cho tất cả các file có đuôi .scss.

use: ['style-loader', 'css-loader', 'sass-loader']: Các loader được áp dụng theo thứ tự ngược lại (từ phải sang trái).

sass-loader: Biên dịch mã SCSS của bạn thành CSS thuần.

css-loader: Xử lý @import và url() trong CSS đã được biên dịch.

style-loader: Chèn CSS đã xử lý vào thẻ <style> trong DOM của trang HTML của bạn.

Bước 3: Thay đổi file CSS thành SCSS
Thay vì sử dụng src/style.css, bạn có thể đổi tên nó thành src/style.scss và bắt đầu viết SCSS.

Đổi tên file:
Đổi tên src/style.css thành src/style.scss.

Cập nhật import trong src/index.js:

JavaScript

import App from './app';
import './style.scss'; // Thay vì './style.css'

const appContainer = document.getElementById('app');

if (appContainer) {
    const app = new App(appContainer);
    app.init();
} else {
    console.error('Element with ID "app" not found.');
}
Viết SCSS trong src/style.scss:

Bạn có thể bắt đầu sử dụng các tính năng của Sass như biến, mixin, nesting, v.v.

SCSS

// Ví dụ về sử dụng biến trong SCSS
$primary-color: #007bff;
$text-color: #333;
$bg-color: #f4f4f4;
$card-bg: #fff;
$card-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

body {
    font-family: sans-serif;
    margin: 20px;
    background-color: $bg-color;
    color: $text-color;
}

#app {
    background-color: $card-bg;
    padding: 20px;
    border-radius: 8px;
    box-shadow: $card-shadow;

    // Ví dụ về nesting trong SCSS
    nav {
        margin-top: 20px;

        a {
            margin-right: 15px;
            text-decoration: none;
            color: $primary-color;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
Bước 4: Chạy lại Dự án
Sau khi đã cài đặt các loader và cập nhật cấu hình, hãy chạy lại dự án của bạn:

Bash

npm run start
Webpack giờ đây sẽ có thể xử lý các file SCSS của bạn, biên dịch chúng thành CSS và chèn vào ứng dụng của bạn. Bạn đã sẵn sàng để tận dụng sức mạnh của Sass trong dự án Vanilla JS SPA của mình!

Bạn có muốn thêm các tính năng Webpack nâng cao khác không, ví dụ như tối ưu hóa hình ảnh hoặc tách CSS thành các file riêng biệt?

## npm run build
npm run build