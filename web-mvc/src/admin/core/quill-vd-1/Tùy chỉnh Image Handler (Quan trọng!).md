# Tùy chỉnh Image Handler (Quan trọng!)

Bạn nhận thấy rất đúng! Trong phần Quickstart của tài liệu Quill.js, bạn sẽ không thấy một đoạn code trực tiếp để chèn hình ảnh. Điều này là do Quill.js có cách tiếp cận linh hoạt hơn với việc xử lý hình ảnh, đặc biệt là khi liên quan đến việc tải ảnh lên máy chủ.

1. Tại sao không thấy nút chèn ảnh trong Quickstart?
Quill.js, theo mặc định, không tự động tích hợp chức năng tải ảnh lên máy chủ (upload). Khi bạn bấm vào nút chèn ảnh hoặc kéo/thả ảnh vào editor, Quill.js sẽ kích hoạt một handler (bộ xử lý) mà bạn cần định nghĩa.

Quickstart tập trung vào những điều cơ bản nhất: Mục tiêu của phần quickstart là giúp bạn khởi tạo editor nhanh chóng với các tính năng soạn thảo văn bản cơ bản. Các tính năng nâng cao như chèn ảnh, video, bảng biểu thường yêu cầu cấu hình và xử lý thêm.

Quill.js không có chức năng upload file mặc định: Quill.js không có code tích hợp sẵn để giao tiếp với máy chủ để tải ảnh lên. Nó chỉ cung cấp cơ chế để bạn thay thế hành vi mặc định của nút ảnh bằng một hàm tùy chỉnh của riêng bạn.

2. Cách bật và xử lý tính năng chèn ảnh trong Quill.js
Để có thể chèn ảnh vào Quill.js, bạn cần thực hiện hai bước chính:

Bước 1: Bật nút chèn ảnh trên thanh công cụ
Đảm bảo rằng mảng cấu hình toolbar của bạn có chứa chuỗi 'image'. Nếu bạn sử dụng cấu hình thanh công cụ mặc định (ví dụ: toolbar: true), nút ảnh đã có sẵn. Nếu bạn tùy chỉnh thanh công cụ, hãy chắc chắn thêm nó vào:

JavaScript

const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            // Các nút định dạng khác...
            ['link', 'image', 'video'], // Đảm bảo 'image' có trong danh sách
            // Các nút khác...
        ]
    }
});
Khi bạn nhấp vào nút hình ảnh, theo mặc định, Quill.js sẽ hiển thị một hộp thoại yêu cầu bạn nhập URL của hình ảnh. Nếu bạn muốn người dùng tải lên ảnh từ máy tính, bạn cần đến bước tiếp theo.

Bước 2: Tùy chỉnh Image Handler (Quan trọng!)
Đây là bước quan trọng nhất để xử lý việc tải ảnh lên. Bạn cần định nghĩa một hàm tùy chỉnh (imageHandler) sẽ được gọi khi người dùng bấm vào nút ảnh hoặc kéo/thả ảnh vào editor. Hàm này sẽ chịu trách nhiệm:

Mở hộp thoại chọn tệp (file input).

Lấy tệp ảnh đã chọn.

Tải tệp ảnh đó lên máy chủ của bạn (sử dụng fetch hoặc XMLHttpRequest).

Sau khi ảnh được tải lên thành công, bạn nhận được URL của ảnh từ máy chủ và chèn URL đó vào trình soạn thảo Quill.js.

Dưới đây là ví dụ minh họa cách triển khai imageHandler với Vanilla JavaScript:
Quill.js Custom Image Handler
23:45 19 thg 8

Mở

Giải thích về Image Handler trong code trên:
toolbar.handlers.image: Đây là cách bạn ghi đè hành vi mặc định của nút hình ảnh trong thanh công cụ Quill. Khi người dùng nhấp vào nút hình ảnh, hàm selectLocalImage của chúng ta sẽ được gọi.

selectLocalImage():

Tạo một <input type="file"> ẩn trong JavaScript.

Sử dụng input.click() để mở hộp thoại chọn tệp của trình duyệt.

Sử dụng input.onchange để bắt sự kiện khi người dùng chọn một tệp.

Trong onchange, bạn sẽ có quyền truy cập vào file đã chọn. Đây là nơi bạn thực hiện logic tải ảnh lên máy chủ (ví dụ: dùng FormData và fetch API).

Sau khi tải lên thành công và nhận được URL của ảnh từ máy chủ, bạn gọi insertImageToEditor(imageUrl).

insertImageToEditor(imageUrl):

Sử dụng quill.getSelection(true) để lấy vị trí con trỏ hiện tại trong editor.

Sử dụng quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER) để chèn hình ảnh vào editor tại vị trí con trỏ. imageUrl chính là đường dẫn mà máy chủ của bạn trả về.

Xử lý kéo thả và dán ảnh (drag-and-drop & paste):

Quill có một module clipboard và drop events để bạn có thể tùy chỉnh hành vi khi ảnh được dán từ clipboard hoặc kéo thả vào editor.

Trong ví dụ trên, tôi đã thêm logic để giả lập việc xử lý ảnh dán từ clipboard và kéo thả ảnh, sau đó chèn vào editor. Trong thực tế, bạn cũng sẽ gửi các tệp này lên máy chủ để nhận lại URL.

Bằng cách triển khai một imageHandler tùy chỉnh như thế này, bạn có thể kiểm soát hoàn toàn quá trình tải ảnh lên và chèn ảnh vào Quill.js, đồng thời tích hợp nó với Bun Vite và VanillaJS một cách liền mạch.

## code

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quill.js with Custom Image Handler</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Inter Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Quill.js Snow theme stylesheet -->
    <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            background-color: #f0f2f5;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 20px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #editor {
            height: 300px;
            width: 100%;
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow-y: auto;
        }
        .ql-toolbar.ql-snow {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border: 1px solid #e0e0e0;
            border-bottom: none;
        }
        .ql-container.ql-snow {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }
        #upload-status {
            margin-top: 10px;
            font-size: 0.9em;
            color: #555;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Quill.js Editor with Image Upload</h1>

        <div id="editor">
            <p>Thử chèn ảnh vào đây bằng cách click vào biểu tượng ảnh trên thanh công cụ!</p>
            <p>Hoặc kéo thả ảnh trực tiếp vào editor.</p>
        </div>

        <div id="upload-status"></div>
    </div>

    <!-- Quill.js library -->
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Khởi tạo Quill editor
            const quill = new Quill('#editor', {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super'}],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image', 'video'] // Đảm bảo nút 'image' có mặt
                        ],
                        handlers: {
                            // Định nghĩa custom handler cho nút 'image'
                            'image': () => {
                                selectLocalImage();
                            }
                        }
                    }
                }
            });

            const uploadStatus = document.getElementById('upload-status');

            // Hàm để chọn ảnh từ máy tính
            function selectLocalImage() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*'); // Chỉ chấp nhận các file ảnh
                input.click(); // Kích hoạt hộp thoại chọn file

                input.onchange = () => {
                    const file = input.files[0];
                    if (file) {
                        uploadStatus.textContent = `Đang tải ảnh "${file.name}" lên...`;
                        // Gọi hàm tải ảnh lên server
                        // Trong ví dụ này, chúng ta sẽ giả lập việc tải lên thành công sau 2 giây
                        // Trong thực tế, bạn sẽ gửi file này lên API của bạn
                        setTimeout(() => {
                            // Giả lập URL của ảnh sau khi tải lên
                            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh local
                            insertImageToEditor(imageUrl);
                            uploadStatus.textContent = `Tải ảnh "${file.name}" thành công!`;
                        }, 2000); // Giả lập độ trễ 2 giây
                    }
                };
            }

            // Hàm để chèn ảnh vào editor
            function insertImageToEditor(imageUrl) {
                const range = quill.getSelection(true); // Lấy vị trí con trỏ hiện tại
                // Chèn ảnh vào vị trí con trỏ
                quill.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
                // Di chuyển con trỏ xuống sau ảnh
                quill.setSelection(range.index + 1, Quill.sources.SILENT);
            }

            // Xử lý kéo thả ảnh và dán ảnh từ clipboard
            quill.getModule('toolbar').addHandler('image', selectLocalImage);

            // Bắt sự kiện khi ảnh được dán vào editor
            quill.clipboard.addMatcher('IMG', (node, delta) => {
                // Khi một ảnh được dán, Quill có thể chuyển nó thành base64 data URL
                // Nếu bạn muốn xử lý nó (ví dụ: upload lên server), bạn cần lấy base64 data
                const src = node.getAttribute('src');
                if (src && src.startsWith('data:image')) {
                    uploadStatus.textContent = `Đang xử lý ảnh dán từ clipboard...`;
                    // Giả lập quá trình upload từ base64 data URL
                    setTimeout(() => {
                        // Trong thực tế, bạn sẽ gửi `src` (base64 data) này lên server
                        // và nhận lại URL ảnh đã upload để chèn vào editor.
                        // Ở đây, chúng ta chỉ chèn lại chính base64 data hoặc một placeholder
                        // For demonstration, let's use a placeholder image URL
                        const uploadedImageUrl = 'https://placehold.co/600x400/AD90FF/FFFFFF?text=Pasted_Image';
                        insertImageToEditor(uploadedImageUrl);
                        uploadStatus.textContent = `Ảnh dán đã được xử lý!`;
                    }, 1500);
                    // Ngăn chặn Quill chèn ảnh base64 mặc định để chúng ta có thể chèn lại URL
                    return new Delta().retain(delta.length());
                }
                return delta; // Trả về delta gốc nếu không phải base64 image
            });

            // Bắt sự kiện khi một file được kéo và thả vào editor
            quill.root.addEventListener('drop', (event) => {
                event.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
                const files = event.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (file.type.startsWith('image/')) {
                        uploadStatus.textContent = `Đang tải ảnh "${file.name}" từ kéo thả lên...`;
                        // Giả lập quá trình upload file
                        setTimeout(() => {
                            const imageUrl = URL.createObjectURL(file);
                            insertImageToEditor(imageUrl);
                            uploadStatus.textContent = `Tải ảnh "${file.name}" thành công!`;
                        }, 2000);
                    }
                }
            });
            // Ngăn chặn hành vi mặc định của trình duyệt khi kéo qua editor
            quill.root.addEventListener('dragover', (event) => {
                event.preventDefault();
            });
        });
    </script>
</body>
</html>
