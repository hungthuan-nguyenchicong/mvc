## v1

Tuyệt vời! Học VanillaJS Single Page Application (SPA) là một cách tuyệt vời để hiểu sâu về cách các framework như React, Vue, hay Angular hoạt động dưới lớp vỏ bọc. Bạn sẽ nắm được những nguyên lý cốt lõi của một SPA.

VanillaJS SPA là gì?
Single Page Application (SPA) là một ứng dụng web chỉ tải một tài liệu HTML duy nhất (thường là index.html) và sau đó động thay đổi nội dung trang dựa trên tương tác của người dùng mà không cần tải lại toàn bộ trang. JavaScript chịu trách nhiệm cập nhật DOM, quản lý trạng thái, và xử lý định tuyến (routing) phía client.

VanillaJS có nghĩa là chúng ta sẽ không sử dụng bất kỳ thư viện hay framework nào khác (như jQuery, React, Vue) mà chỉ dùng JavaScript thuần túy.

Ví dụ SPA VanillaJS cơ bản: Ứng dụng "Trang Đơn Giản"
Chúng ta sẽ xây dựng một SPA siêu cơ bản với 3 trang: Home, About, và Contact.

Cấu trúc dự án:

your-spa-project/
├── public/
│   ├── index.html
│   └── style.css
└── src/
    └── index.js
1. public/index.html

Đây là file HTML duy nhất mà trình duyệt sẽ tải. Nó chứa một thanh điều hướng đơn giản và một vùng để hiển thị nội dung của các trang.

HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VanillaJS SPA</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <ul>
            <li><a href="/" data-path="/">Home</a></li>
            <li><a href="/about" data-path="/about">About</a></li>
            <li><a href="/contact" data-path="/contact">Contact</a></li>
        </ul>
    </nav>

    <main id="app-root"></main>

    <script type="module" src="bundle.js"></script> 
    </body>
</html>
Lưu ý quan trọng:

Các thẻ <a> có href đầy đủ (/, /about, /contact).

Chúng ta thêm thuộc tính data-path để dễ dàng lấy đường dẫn mong muốn trong JavaScript.

main id="app-root" là nơi nội dung của các "trang" sẽ được chèn vào.

script type="module" src="bundle.js" giả định bạn đã cấu hình Webpack để tạo bundle.js và đặt nó vào thư mục public. Nếu bạn chưa có Webpack, bạn có thể tạm thời sửa thành <script type="module" src="../src/index.js"></script> để chạy trực tiếp (nhưng nên dùng Webpack cho dự án thực tế).

2. public/style.css (Tùy chọn, để nhìn đẹp hơn)

CSS

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
}

nav {
    background-color: #333;
    padding: 1rem 0;
    text-align: center;
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
}

nav ul li {
    margin: 0 15px;
}

nav ul li a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

nav ul li a:hover,
nav ul li a.active {
    background-color: #555;
}

main {
    padding: 2rem;
    max-width: 800px;
    margin: 2rem auto;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
3. src/index.js (Trái tim của SPA)

JavaScript

// Lấy phần tử gốc để hiển thị nội dung trang
const appRoot = document.getElementById('app-root');

// Định nghĩa các trang (components) của chúng ta
const routes = {
    '/': {
        title: 'Home Page',
        content: `
            <h1>Welcome to the Home Page!</h1>
            <p>This is a simple VanillaJS SPA example.</p>
            <p>Navigate using the links above.</p>
        `
    },
    '/about': {
        title: 'About Us',
        content: `
            <h1>About Us</h1>
            <p>We are learning VanillaJS SPAs.</p>
            <p>This page demonstrates client-side routing.</p>
        `
    },
    '/contact': {
        title: 'Contact Us',
        content: `
            <h1>Contact Us</h1>
            <p>You can reach us at example@example.com</p>
            <form>
                <input type="text" placeholder="Your Name"><br>
                <textarea placeholder="Your Message"></textarea><br>
                <button type="submit">Send</button>
            </form>
        `
    },
    // Trang 404 (Not Found)
    '/404': {
        title: 'Page Not Found',
        content: `
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <p><a href="/" data-path="/">Go to Home</a></p>
        `
    }
};

// Hàm để hiển thị nội dung trang dựa trên đường dẫn
const renderContent = (path) => {
    // Lấy thông tin trang từ routes, nếu không tìm thấy thì dùng trang 404
    const page = routes[path] || routes['/404'];
    
    // Cập nhật tiêu đề tài liệu
    document.title = page.title;
    
    // Chèn nội dung HTML vào appRoot
    appRoot.innerHTML = page.content;

    // Cập nhật trạng thái "active" cho navigation links
    document.querySelectorAll('nav ul li a').forEach(link => {
        if (link.getAttribute('data-path') === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Hàm xử lý khi người dùng click vào link
const navigate = (event) => {
    // Ngăn chặn hành vi mặc định của thẻ <a> (tải lại trang)
    event.preventDefault(); 
    
    // Lấy đường dẫn từ thuộc tính data-path của thẻ <a>
    const path = event.target.getAttribute('data-path');

    // Cập nhật URL trong thanh địa chỉ mà không tải lại trang
    // history.pushState(state, title, url)
    window.history.pushState({}, '', path);
    
    // Hiển thị nội dung trang tương ứng
    renderContent(path);
};

// Hàm xử lý khi người dùng sử dụng nút Back/Forward của trình duyệt
const handlePopState = () => {
    // Lấy đường dẫn hiện tại từ URL
    renderContent(window.location.pathname);
};

// Khởi tạo ứng dụng:
// 1. Gán sự kiện click cho tất cả các link điều hướng
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', navigate);
});

// 2. Lắng nghe sự kiện popstate để xử lý nút Back/Forward
window.addEventListener('popstate', handlePopState);

// 3. Hiển thị nội dung trang Home khi ứng dụng vừa tải (hoặc trang hiện tại nếu có)
renderContent(window.location.pathname);

// Xử lý các đường dẫn không hợp lệ khi tải trực tiếp
if (!routes[window.location.pathname]) {
    window.history.replaceState({}, '', '/404'); // Thay đổi URL thành /404 mà không push vào lịch sử
    renderContent('/404');
}
Giải thích các khái niệm cốt lõi:
Định tuyến phía Client (Client-Side Routing):

routes object: Một đối tượng JavaScript ánh xạ các đường dẫn URL (/, /about, /contact) tới nội dung tương ứng (content) và tiêu đề trang (title). Đây là "bảng định tuyến" của bạn.

renderContent(path): Hàm này lấy đường dẫn, tìm nội dung tương ứng trong đối tượng routes, và sau đó chèn nội dung HTML đó vào phần tử <main id="app-root"> của bạn. Nó cũng cập nhật tiêu đề trang.

Maps(event): Khi bạn click vào một link điều hướng:

event.preventDefault(): Rất quan trọng! Nó ngăn chặn trình duyệt thực hiện hành vi mặc định của thẻ <a> (tức là tải lại toàn bộ trang).

window.history.pushState({}, '', path): Đây là API History của HTML5. Nó cho phép bạn thay đổi URL trên thanh địa chỉ của trình duyệt mà không cần tải lại trang. Nó cũng thêm một mục mới vào lịch sử trình duyệt, cho phép người dùng sử dụng nút Back/Forward.

Sau khi cập nhật URL, chúng ta gọi renderContent(path) để hiển thị nội dung trang mới.

window.addEventListener('popstate', handlePopState):

Sự kiện popstate được kích hoạt khi người dùng điều hướng qua lịch sử trình duyệt (sử dụng nút Back/Forward của trình duyệt).

Khi sự kiện này xảy ra, chúng ta chỉ cần lấy đường dẫn hiện tại từ window.location.pathname và gọi lại renderContent để hiển thị nội dung phù hợp.

Tải trang ban đầu:

renderContent(window.location.pathname): Khi ứng dụng được tải lần đầu, chúng ta gọi hàm này để hiển thị nội dung của đường dẫn hiện tại (ví dụ: / nếu bạn truy cập localhost:9000).

Phần xử lý 404 khi tải trực tiếp giúp đảm bảo rằng nếu người dùng truy cập một URL không tồn tại (/xyz) ngay từ đầu, họ sẽ thấy trang 404.

Cách chạy ví dụ này với Webpack:
Nếu bạn đã có cấu hình Webpack như đã thảo luận:

Đảm bảo public/index.html của bạn không chứa thẻ <script> thủ công trỏ đến bundle.js. HtmlWebpackPlugin sẽ tự thêm nó.

Chỉnh sửa webpack.config.js để bao gồm HtmlWebpackPlugin và output.path trỏ đến public như chúng ta đã làm:

JavaScript

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[contenthash].js', // Sẽ là bundle.xxxxxxxx.js
        path: path.resolve(__dirname, 'public'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'VanillaJS SPA',
            template: './public/index.html', // File mẫu HTML của bạn
            scriptLoading: 'module', // Để script được thêm với type="module"
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
    }
};
Chạy ứng dụng:

Bash

npm run dev
Ứng dụng sẽ mở trong Chrome, và bạn có thể click vào các link để chuyển đổi giữa các trang mà không cần tải lại toàn bộ trang!

Đây là một ví dụ rất cơ bản, nhưng nó minh họa rõ ràng các nguyên tắc cốt lõi của một SPA VanillaJS: quản lý DOM, định tuyến phía client bằng History API, và cập nhật giao diện mà không cần tải lại trang. Bạn có muốn đi sâu hơn vào phần nào của ví dụ này không?

