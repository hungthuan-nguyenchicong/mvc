# Bước 1: Cài đặt thêm Dependencies
npm install --save-dev mini-css-extract-plugin css-minimizer-webpack-plugin
## Bước 2: Cập nhật webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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

### Các thay đổi chính và giải thích:

Các thay đổi chính và giải thích:

module.exports = (env, argv) => { ... }: Chúng ta chuyển module.exports thành một hàm để có thể truy cập các tham số dòng lệnh như mode mà Webpack truyền vào.

const isProduction = argv.mode === 'production';: Biến này giúp chúng ta dễ dàng chuyển đổi cấu hình giữa development và production.

output.filename: Đặt tên file JS đầu ra là bundle.[contenthash].min.js khi ở chế độ production.

output.clean: true: (Webpack 5 trở lên) Tự động dọn dẹp thư mục dist trước khi build, loại bỏ sự cần thiết của CleanWebpackPlugin. Bạn có thể bỏ new CleanWebpackPlugin() khỏi mảng plugins.

Cập nhật test cho CSS/SCSS rules: test: /\.(css|scss)$/ để quy tắc này áp dụng cho cả hai loại file.

Conditional MiniCssExtractPlugin.loader:

isProduction ? MiniCssExtractPlugin.loader : 'style-loader' : Nếu là production, sử dụng loader của MiniCssExtractPlugin để trích xuất CSS vào file riêng. Nếu không, vẫn sử dụng style-loader để inject vào DOM (tốt cho dev server).

MiniCssExtractPlugin trong plugins:

isProduction && new MiniCssExtractPlugin({ ... }): Plugin này chỉ được thêm vào khi isProduction là true.

filename: 'styles.[contenthash].min.css': Đặt tên cho file CSS đã trích xuất và minify.

optimization.minimizer:

minimizer: [..., isProduction && new CssMinimizerPlugin(),] : Đây là nơi bạn cấu hình các plugin minification. ... (spread operator) bao gồm các minimizer mặc định của Webpack (ví dụ: TerserPlugin cho JavaScript). Chúng ta thêm CssMinimizerPlugin vào chỉ khi isProduction là true.

plugins.filter(Boolean) và minimizer.filter(Boolean): Được dùng để loại bỏ các giá trị false (kết quả của isProduction && plugin) khỏi mảng, đảm bảo chỉ các plugin cần thiết được thêm vào.

resolve.extensions: Đã thêm .css để đảm bảo khả năng import file .css mà không cần đuôi mở rộng.

## package.json

{
  "name": "my-vanilla-spa",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --config webpack.config.js --node-env development --mode development",
    "build": "webpack --config webpack.config.js --node-env production --mode production",
    "build-prod": "webpack --config webpack.config.js --node-env production --mode production",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.24.7",
    "@babel/preset-env": "^7.24.7",
    "babel-loader": "^9.1.3",
    "clean-webpack-plugin": "^4.0.0",
    "css-loader": "^7.1.2",
    "html-webpack-plugin": "^5.6.0",
    "mini-css-extract-plugin": "^2.9.0",
    "sass": "^1.77.7",
    "sass-loader": "^14.2.1",
    "style-loader": "^4.0.0",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4",
    "css-minimizer-webpack-plugin": "^7.0.0"
  }
}


## học

Bạn muốn có một script riêng biệt cho build production (npm run build-prod) và đảm bảo rằng CSS cũng được minify thành một file .min.css riêng biệt, không chỉ được inject bởi style-loader.

Hiện tại, style-loader chèn CSS trực tiếp vào DOM dưới dạng thẻ <style>, điều này không lý tưởng cho production. Để tạo ra một file CSS riêng và minify nó, chúng ta cần sử dụng thêm hai plugin:

mini-css-extract-plugin: Để trích xuất CSS từ các file JavaScript bundle thành các file .css riêng biệt.

css-minimizer-webpack-plugin: Để minify (rút gọn) các file CSS đã được trích xuất.

Bước 1: Cài đặt thêm Dependencies
Bash

npm install --save-dev mini-css-extract-plugin css-minimizer-webpack-plugin
mini-css-extract-plugin: Trích xuất CSS thành các file riêng biệt.

css-minimizer-webpack-plugin: Minify CSS trong quá trình build production.

Bước 2: Cập nhật webpack.config.js
Chúng ta sẽ làm cho cấu hình Webpack linh hoạt hơn bằng cách kiểm tra môi trường build (process.env.NODE_ENV) để áp dụng các loader và plugin khác nhau cho development và production.

JavaScript

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
Các thay đổi chính và giải thích:

module.exports = (env, argv) => { ... }: Chúng ta chuyển module.exports thành một hàm để có thể truy cập các tham số dòng lệnh như mode mà Webpack truyền vào.

const isProduction = argv.mode === 'production';: Biến này giúp chúng ta dễ dàng chuyển đổi cấu hình giữa development và production.

output.filename: Đặt tên file JS đầu ra là bundle.[contenthash].min.js khi ở chế độ production.

output.clean: true: (Webpack 5 trở lên) Tự động dọn dẹp thư mục dist trước khi build, loại bỏ sự cần thiết của CleanWebpackPlugin. Bạn có thể bỏ new CleanWebpackPlugin() khỏi mảng plugins.

Cập nhật test cho CSS/SCSS rules: test: /\.(css|scss)$/ để quy tắc này áp dụng cho cả hai loại file.

Conditional MiniCssExtractPlugin.loader:

isProduction ? MiniCssExtractPlugin.loader : 'style-loader' : Nếu là production, sử dụng loader của MiniCssExtractPlugin để trích xuất CSS vào file riêng. Nếu không, vẫn sử dụng style-loader để inject vào DOM (tốt cho dev server).

MiniCssExtractPlugin trong plugins:

isProduction && new MiniCssExtractPlugin({ ... }): Plugin này chỉ được thêm vào khi isProduction là true.

filename: 'styles.[contenthash].min.css': Đặt tên cho file CSS đã trích xuất và minify.

optimization.minimizer:

minimizer: [..., isProduction && new CssMinimizerPlugin(),] : Đây là nơi bạn cấu hình các plugin minification. ... (spread operator) bao gồm các minimizer mặc định của Webpack (ví dụ: TerserPlugin cho JavaScript). Chúng ta thêm CssMinimizerPlugin vào chỉ khi isProduction là true.

plugins.filter(Boolean) và minimizer.filter(Boolean): Được dùng để loại bỏ các giá trị false (kết quả của isProduction && plugin) khỏi mảng, đảm bảo chỉ các plugin cần thiết được thêm vào.

resolve.extensions: Đã thêm .css để đảm bảo khả năng import file .css mà không cần đuôi mở rộng.

Bước 3: Cập nhật package.json
Thêm script build-prod mới.

JSON

{
  "name": "my-vanilla-spa",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --config webpack.config.js --node-env development --mode development",
    "build": "webpack --config webpack.config.js --node-env production --mode production",
    "build-prod": "webpack --config webpack.config.js --node-env production --mode production",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.24.7",
    "@babel/preset-env": "^7.24.7",
    "babel-loader": "^9.1.3",
    "clean-webpack-plugin": "^4.0.0",
    "css-loader": "^7.1.2",
    "html-webpack-plugin": "^5.6.0",
    "mini-css-extract-plugin": "^2.9.0",
    "sass": "^1.77.7",
    "sass-loader": "^14.2.1",
    "style-loader": "^4.0.0",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4",
    "css-minimizer-webpack-plugin": "^7.0.0"
  }
}
Lưu ý:

Tôi đã thêm --mode development và --mode production vào các script start và build để truyền giá trị mode vào hàm module.exports trong webpack.config.js.

Script build và build-prod hiện tại giống hệt nhau về chức năng vì cả hai đều chạy ở chế độ production. Bạn có thể giữ một trong hai tùy theo thói quen đặt tên của mình. npm run build là phổ biến hơn cho việc build production.

Bước 4: Chạy thử
Cài đặt các dependencies mới:

Bash

npm install
Chạy build production:

Bash

npm run build-prod
hoặc

Bash

npm run build
Sau khi chạy lệnh này, bạn sẽ thấy trong thư mục dist có một file JavaScript đã được minify (ví dụ: bundle.xxxxxxxx.min.js) và một file CSS cũng đã được minify (ví dụ: styles.xxxxxxxx.min.css).

Bây giờ bạn đã có một quá trình build tối ưu hơn cho production, với cả JS và CSS đều được minify và CSS được tách ra thành một file riêng!