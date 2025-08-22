## Tích hợp Quill.js với Bun Vite và VanillaJS
Quill.js là một trong những trình soạn thảo văn bản phong phú (WYSIWYG editor) phổ biến nhất hiện nay, được đánh giá cao về sự nhẹ, linh hoạt và dễ tùy chỉnh. Nó rất phù hợp cho các dự án web hiện đại sử dụng Vanilla JavaScript và các công cụ bundling như Bun Vite.

1. Giới thiệu tổng quan về Quill.js
Quill.js được thiết kế với kiến trúc mô-đun, cho phép bạn chỉ sử dụng những tính năng cần thiết và dễ dàng mở rộng chức năng. Thay vì là một "black box" khó điều khiển, Quill.js cung cấp một API mạnh mẽ cho phép bạn truy cập và thao tác với nội dung của trình soạn thảo một cách chi tiết. Điều này giúp các nhà phát triển có toàn quyền kiểm soát giao diện và hành vi của editor.

2. Giao diện và tính năng cơ bản của Quill.js
Giao diện cơ bản
Giao diện mặc định của Quill.js khá tối giản nhưng đầy đủ, thường bao gồm:

Thanh công cụ (Toolbar): Nơi chứa các nút điều khiển định dạng văn bản như in đậm, in nghiêng, gạch chân, danh sách, căn chỉnh, màu sắc, v.v. Thanh công cụ này có thể được tùy chỉnh hoàn toàn.

Vùng soạn thảo (Editor Area): Khu vực chính nơi người dùng nhập và định dạng văn bản. Vùng này có thể mở rộng tùy thuộc vào nội dung hoặc có chiều cao cố định với thanh cuộn.

Tính năng cơ bản
Quill.js hỗ trợ hầu hết các tính năng soạn thảo văn bản mà bạn mong đợi từ một trình soạn thảo WYSIWYG hiện đại:

Định dạng văn bản: In đậm, in nghiêng, gạch chân, gạch ngang, chỉ số trên/dưới.

Cỡ chữ & Phông chữ: Thay đổi kích thước và kiểu phông chữ.

Màu sắc: Thay đổi màu chữ và màu nền.

Căn chỉnh: Căn trái, căn giữa, căn phải, căn đều.

Danh sách: Danh sách có thứ tự (ordered list) và không có thứ tự (bullet list).

Trích dẫn: Tạo khối trích dẫn (blockquote).

Khối mã: Chèn các khối mã (code block) với cú pháp được định dạng.

Chèn đa phương tiện: Chèn hình ảnh và video (yêu cầu cấu hình thêm).

Liên kết: Tạo và chỉnh sửa siêu liên kết (hyperlink).

Hoàn tác/Làm lại: Hỗ trợ các thao tác hoàn tác và làm lại.

3. Tích hợp Quill.js với Bun Vite và VanillaJS
Việc tích hợp Quill.js vào một dự án Bun Vite sử dụng Vanilla JavaScript rất đơn giản nhờ vào khả năng hỗ trợ ES Modules của Vite. Dưới đây là các bước và mã nguồn mẫu:

Đầu tiên, bạn cần có một cấu trúc dự án Bun Vite cơ bản. Nếu chưa có, bạn có thể tạo một dự án mới:

Bash

bun create vite my-quill-app --template vanilla
cd my-quill-app
bun install
Sau đó, bạn cần cài đặt Quill.js:

Bash

bun add quill
Tiếp theo, bạn sẽ chỉnh sửa file index.html và main.js (hoặc src/main.js tùy thuộc vào template của Vite).

Dưới đây là một ví dụ đầy đủ:
Quill.js Integration with Bun Vite VanillaJS
23:39 19 thg 8

Mở

Giải thích các bước tích hợp:
Cấu trúc thư mục: Với Bun Vite, bạn sẽ có một file index.html làm điểm vào và một file JavaScript chính (thường là main.js hoặc src/main.js).

CDN & Cài đặt:

Bạn có thể sử dụng Quill.js thông qua CDN bằng cách thêm các thẻ <link> và <script> vào index.html.

Cách được khuyến nghị hơn là cài đặt Quill.js qua Bun (bun add quill). Khi đó, Vite sẽ tự động xử lý việc bundling các module này.

Import Quill: Trong file JavaScript của bạn (main.js), bạn sẽ import Quill:

JavaScript

import Quill from 'quill'; // Nếu đã cài đặt qua bun add quill
// Hoặc import Quill from '[https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js](https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js)'; // Nếu dùng CDN
Khởi tạo Editor: Bạn tạo một đối tượng Quill mới, truyền vào selector của div mà bạn muốn Quill gắn vào (ví dụ: #editor), và một đối tượng tùy chọn cấu hình:

JavaScript

const quill = new Quill('#editor', {
    theme: 'snow', // Chọn giao diện: 'snow' (mặc định) hoặc 'bubble'
    modules: {
        toolbar: [ /* Cấu hình các nút trên thanh công cụ */ ]
    }
});
theme: Định nghĩa giao diện người dùng. snow là giao diện mặc định với thanh công cụ rõ ràng ở trên cùng.

modules.toolbar: Đây là nơi bạn định nghĩa các nút chức năng sẽ xuất hiện trên thanh công cụ của editor. Bạn có thể tùy chỉnh rất linh hoạt.

Lấy nội dung: Bạn có thể lấy nội dung từ editor dưới nhiều định dạng khác nhau:

quill.root.innerHTML: Trả về nội dung HTML của editor.

quill.getText(): Trả về nội dung văn bản thuần túy.

quill.getContents(): Trả về nội dung dưới dạng Delta (một định dạng JSON của Quill, rất hữu ích cho việc lưu trữ và xử lý nội dung một cách có cấu trúc).

Sau khi chạy lệnh bun run dev (hoặc npm run dev nếu dùng npm) trong terminal của dự án, bạn sẽ thấy Quill.js editor hoạt động trong trình duyệt của mình, sẵn sàng cho việc soạn thảo văn bản.

## code

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill.js with Bun Vite & VanillaJS</title>
    <!-- Link to Tailwind CSS for modern styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Link to Inter font from Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Link to Quill.js Snow theme stylesheet -->
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
    <style>
        /* Basic styling for the body and container */
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Align to the top of the viewport */
            min-height: 100vh;
            background-color: #f0f2f5; /* Light grey background */
        }
        .container {
            width: 100%;
            max-width: 800px; /* Maximum width for the content area */
            margin: 20px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 12px; /* Rounded corners for the container */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        /* Styling for the Quill editor div */
        #editor {
            height: 300px; /* Fixed height for the editor */
            width: 100%;
            margin-bottom: 20px; /* Space below the editor */
            border: 1px solid #e0e0e0; /* Light border */
            border-radius: 8px; /* Rounded corners for the editor */
            overflow-y: auto; /* Enable scrolling if content exceeds height */
        }
        /* Override Quill's default border-radius for consistency */
        .ql-toolbar.ql-snow {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border: 1px solid #e0e0e0;
            border-bottom: none; /* Remove bottom border to blend with container */
        }
        .ql-container.ql-snow {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            border: 1px solid #e0e0e0;
            border-top: none; /* Remove top border to blend with toolbar */
        }
        /* Style for the button */
        #get-content-btn {
            background-color: #4CAF50; /* Green background */
            color: white; /* White text */
            padding: 10px 20px; /* Padding */
            border: none; /* No border */
            border-radius: 8px; /* Rounded corners */
            cursor: pointer; /* Pointer on hover */
            font-size: 16px; /* Font size */
            transition: background-color 0.3s ease; /* Smooth transition */
        }
        #get-content-btn:hover {
            background-color: #45a049; /* Darker green on hover */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Quill.js Editor Example</h1>

        <!-- The div where Quill.js editor will be initialized -->
        <div id="editor">
            <p>Xin chào Việt Nam! 👋</p>
            <p>Đây là một ví dụ về **Quill.js** được tích hợp với <i>Bun Vite</i> và <u>VanillaJS</u>.</p>
            <p><br></p>
            <p>Bạn có thể thử các tính năng định dạng như:</p>
            <ul>
                <li>Danh sách</li>
                <li><strong style="color: rgb(230, 0, 0);">Màu sắc</strong></li>
                <li>Căn chỉnh <span class="ql-align-right">văn bản</span></li>
            </ul>
            <p>Và nhiều hơn nữa!</p>
        </div>

        <!-- Button to demonstrate getting content from the editor -->
        <button id="get-content-btn">Lấy Nội Dung Editor</button>
    </div>

    <!-- Your main JavaScript file, remember type="module" for Vite -->
    <script type="module" src="/main.js"></script>
</body>
</html>
```javascript
// src/main.js (or main.js if in root)
// Import Quill directly from its CDN path or node_modules for local installation
import Quill from 'quill'; // If you installed via 'bun add quill'
// Or if you prefer CDN:
// import Quill from '[https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js](https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js)';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow', // Choose a theme: 'snow' or 'bubble'
        placeholder: 'Bắt đầu viết ở đây...', // Placeholder text
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // Định dạng văn bản: in đậm, in nghiêng, gạch chân, gạch ngang
                ['blockquote', 'code-block'],                     // Khối trích dẫn, khối mã

                [{ 'header': 1 }, { 'header': 2 }],               // Tiêu đề 1, Tiêu đề 2
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // Danh sách có thứ tự, không có thứ tự
                [{ 'script': 'sub'}, { 'script': 'super'}],      // Chỉ số dưới, chỉ số trên
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // Giảm thụt lề, tăng thụt lề
                [{ 'direction': 'rtl' }],                         // Hướng văn bản (từ phải sang trái)

                [{ 'size': ['small', false, 'large', 'huge'] }],  // Kích thước chữ (small, default, large, huge)
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         // Các cấp độ tiêu đề khác

                [{ 'color': [] }, { 'background': [] }],          // Màu chữ, màu nền
                [{ 'font': [] }],                                 // Phông chữ
                [{ 'align': [] }],                                // Căn chỉnh văn bản

                ['clean'],                                        // Xóa định dạng
                ['link', 'image', 'video']                        // Chèn liên kết, hình ảnh, video
            ]
        }
    });

    // Example: How to get the content from the editor
    document.getElementById('get-content-btn').addEventListener('click', () => {
        // Get the HTML content
        const htmlContent = quill.root.innerHTML;
        console.log("HTML Content:", htmlContent);

        // Get the plain text content
        const textContent = quill.getText();
        console.log("Plain Text Content:", textContent);

        // Quill also has its own format called Delta, which is a JSON representation
        const delta = quill.getContents();
        console.log("Delta Format:", delta);

        // In a real application, you would typically send `htmlContent` or `delta`
        // to a server to save it in a database.
    });

    // You can also set initial content programmatically
    // quill.setContents([
    //     { insert: 'Hello ' },
    //     { insert: 'World!', attributes: { bold: true } },
    //     { insert: '\n' }
    // ]);
});
