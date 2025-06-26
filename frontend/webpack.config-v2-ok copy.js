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