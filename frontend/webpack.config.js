const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Import mới
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Import mới

module.exports = (env, argv) => { // Truyền env và argv để lấy mode
  const isProduction = argv.mode === 'production'; // Kiểm tra xem có phải là production hay không

  return {
    // Chế độ phát triển (development) hoặc sản xuất (production)
    mode: argv.mode, // Lấy mode từ argv

    // Điểm vào (entry point) của ứng dụng
    entry: './src/index.js',

    // Cấu hình đầu ra (output) của quá trình build
    output: {
      filename: isProduction ? 'bundle.[contenthash].min.js' : 'bundle.[contenthash].js', // Tên file JS khác nhau
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true, // Tùy chọn mới cho Webpack 5 để CleanWebpackPlugin không cần thiết
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
          test: /\.(css|scss)$/, // Kết hợp cả .css và .scss
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // Dùng MiniCssExtractPlugin cho prod, style-loader cho dev
            'css-loader',
            'sass-loader',
          ],
        },
        // Bạn có thể thêm các loader khác cho hình ảnh, font, v.v.
      ],
    },

    // Cấu hình plugins
    plugins: [
      // CleanWebpackPlugin không cần thiết nếu output.clean = true trong Webpack 5
      // new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: 'body',
      }),
      // Thêm MiniCssExtractPlugin chỉ trong chế độ production
      isProduction && new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].min.css', // Tên file CSS minify
      }),
    ].filter(Boolean), // Lọc bỏ các giá trị false/null

    // Cấu hình Dev Server (chỉ dùng cho development)
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
      open: true,
      historyApiFallback: true,
    },

    // Cấu hình tối ưu hóa cho production
    optimization: {
      minimizer: [
        // Đối với JS minification, Webpack 5 tự động kích hoạt TerserPlugin ở mode 'production'
        // Bạn có thể tùy chỉnh TerserPlugin ở đây nếu cần.
        // `...` để mở rộng các minimizer mặc định của Webpack (ví dụ: TerserPlugin cho JS)
        `...`,
        // Thêm CssMinimizerPlugin để minify CSS
        isProduction && new CssMinimizerPlugin(),
      ].filter(Boolean),
    },

    // Cấu hình giải quyết module
    resolve: {
      extensions: ['.js', '.json', '.scss', '.css'], // Thêm .css vào phần extensions
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
  };
};