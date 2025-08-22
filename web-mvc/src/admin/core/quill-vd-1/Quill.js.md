# document
https://quilljs.com/docs/quickstart
## học
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
