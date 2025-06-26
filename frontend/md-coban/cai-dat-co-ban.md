# set up
mkdir my-vanilla-spa
cd my-vanilla-spa
npm init -y

## wb

npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin clean-webpack-plugin css-loader style-loader

## .gitignore
/node_modules
npm update

## Cài đặt Babel (tùy chọn, nhưng rất nên dùng để hỗ trợ ES6+):

npm install --save-dev @babel/core babel-loader @babel/preset-env

# Bước 2: Cấu hình Webpack (webpack.config.js)

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

# Bước 3: Cấu hình Babel (.babelrc)

{
  "presets": ["@babel/preset-env"]
}

# Bước 4: Tạo cấu trúc thư mục và các file cơ bản
## public/index.html:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Vanilla SPA</title>
</head>
<body>
    <div id="app"></div>
    </body>
</html>

## src/index.js

import App from './app';
import './style.css'; // Ví dụ: import CSS

const appContainer = document.getElementById('app');

if (appContainer) {
    const app = new App(appContainer);
    app.init();
} else {
    console.error('Element with ID "app" not found.');
}

## src/app.js

import HomePage from './pages/home';
import AboutPage from './pages/about';
import Router from './router'; // Sẽ tạo file này sau

class App {
    constructor(container) {
        this.container = container;
        this.router = new Router();
        this.routes = {
            '/': HomePage,
            '/about': AboutPage,
        };
    }

    init() {
        this.router.addRoute('/', () => this.renderPage(new HomePage()));
        this.router.addRoute('/about', () => this.renderPage(new AboutPage()));

        // Xử lý khi URL thay đổi (ví dụ: click vào link, sử dụng history API)
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });

        // Xử lý click trên các liên kết để tránh tải lại trang
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('a') && e.target.getAttribute('href').startsWith('/')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });

        // Khởi tạo trang đầu tiên dựa trên URL hiện tại
        this.navigate(window.location.pathname);
    }

    navigate(path) {
        if (window.location.pathname !== path) {
            history.pushState({}, '', path);
        }
        this.router.matchRoute(path);
    }

    renderPage(pageInstance) {
        this.container.innerHTML = ''; // Xóa nội dung cũ
        this.container.appendChild(pageInstance.render());
        pageInstance.afterRender && pageInstance.afterRender(); // Gọi hàm afterRender nếu có
    }
}

export default App;

## src/router.js

class Router {
    constructor() {
        this.routes = {};
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    matchRoute(path) {
        const handler = this.routes[path];
        if (handler) {
            handler();
        } else {
            // Xử lý 404 hoặc chuyển hướng về trang chủ
            console.warn(`No route found for ${path}. Redirecting to home.`);
            this.routes['/'](); // Chuyển hướng về trang chủ
        }
    }
}

export default Router;

## src/pages/home.js

class HomePage {
    render() {
        const element = document.createElement('div');
        element.innerHTML = `
            <h1>Welcome to Home Page!</h1>
            <p>This is a simple Vanilla JS SPA.</p>
            <nav>
                <a href="/about">Go to About Page</a>
            </nav>
        `;
        return element;
    }

    // Có thể thêm các logic sau khi render nếu cần
    afterRender() {
        console.log('Home page rendered!');
    }
}

export default HomePage;

## src/pages/about.js

class AboutPage {
    render() {
        const element = document.createElement('div');
        element.innerHTML = `
            <h1>About Us</h1>
            <p>This is the About page of our Vanilla JS SPA.</p>
            <nav>
                <a href="/">Go to Home Page</a>
            </nav>
        `;
        return element;
    }
}

export default AboutPage;

## src/style.css
body {
    font-family: sans-serif;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
}

#app {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav a {
    margin-right: 15px;
    text-decoration: none;
    color: #007bff;
}

nav a:hover {
    text-decoration: underline;
}

## Bước 5: Thêm script vào package.json

{
  "name": "frontend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --config webpack.config.js --node-env development",
    "build": "webpack --config webpack.config.js --node-env production",
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
    "style-loader": "^4.0.0",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4"
  }
}

## quan trọng

"scripts": {
    "start": "webpack serve --config webpack.config.js --node-env development",
    "build": "webpack --config webpack.config.js --node-env production",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

## chạy thử

npm run start: Chạy dev server với hot-reloading.

npm run build: Build project cho production.

