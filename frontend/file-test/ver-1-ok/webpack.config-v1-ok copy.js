const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // Chế độ phát triển (development) hoặc sản xuất (production)
  mode: 'development', // Có thể thay đổi thành 'production' khi deploy

  // Điểm vào (entry point) của ứng dụng
  entry: './src/index.js',

  // Cấu hình đầu ra (output) của quá trình build
  output: {
    filename: 'bundle.[contenthash].js', // Thêm hash để tránh caching vấn đề
    path: path.resolve(__dirname, 'dist'), // Thư mục đầu ra
    publicPath: '/', // Đường dẫn công khai cho các asset
  },

  // Cấu hình module (loaders)
  module: {
    rules: [
      {
        test: /\.js$/, // Áp dụng cho các file .js
        exclude: /node_modules/, // Loại trừ thư mục node_modules
        use: {
          loader: 'babel-loader', // Sử dụng babel-loader
          options: {
            presets: ['@babel/preset-env'], // Sử dụng preset env của Babel
          },
        },
      },
      {
        test: /\.css$/, // Áp dụng cho các file .css
        use: ['style-loader', 'css-loader'], // Sử dụng style-loader và css-loader
      },
      // Bạn có thể thêm các loader khác cho hình ảnh, font, v.v.
    ],
  },

  // Cấu hình plugins
  plugins: [
    new CleanWebpackPlugin(), // Dọn dẹp thư mục dist trước mỗi lần build
    new HtmlWebpackPlugin({
      template: './public/index.html', // Sử dụng file HTML mẫu
      filename: 'index.html', // Tên file HTML đầu ra
      inject: 'body', // Chèn script vào cuối body
    }),
  ],

  // Cấu hình Dev Server
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Phục vụ các file tĩnh từ thư mục public
    },
    compress: true, // Bật nén gzip
    port: 9000, // Cổng của dev server
    open: true, // Tự động mở trình duyệt khi khởi động dev server
    historyApiFallback: true, // Quan trọng cho SPA: chuyển hướng tất cả các yêu cầu 404 về index.html
  },

  // Cấu hình giải quyết module
  resolve: {
    extensions: ['.js', '.json'], // Cho phép import các file này mà không cần đuôi
    alias: {
      '@': path.resolve(__dirname, 'src/'), // Tạo alias cho thư mục src
    },
  },
};