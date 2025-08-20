// web-mvc/src/admin/template/pages/testWysiwyg.js
import Quill from 'quill'; // Chỉ import thư viện Quill chính
//import "quill/dist/quill.core.css"; // Giữ lại CSS core nếu bạn cần
//import "quill/dist/quill.core.css"; // Nếu bạn cần CSS cơ bản
// Hoặc chỉ cần import theme CSS nếu nó đã bao gồm core CSS
import "quill/dist/quill.snow.css";
function testWysiwyg() {
    const container = document.querySelector('.content');

    function index() {
        // Tạo cấu trúc HTML cho editor
                    // <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />

        const htmlContent = `
            <div id="editor">
                <p>Hello World!</p>
                <p>Some initial <strong>bold</strong> text</p>
                <p><br /></p>
            </div>
        `;

        // Chèn HTML vào container
        container.innerHTML = htmlContent;

        // Khởi tạo Quill sau khi phần tử editor đã có trong DOM
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
                        ['link', 'video','image']
                    ],
                    handlers: {
                        'link': function(value) {
                            const quillInstance = this.quill; // Lấy instance của Quill editor

                            console.log("--- BẮT ĐẦU QUÁ TRÌNH CHÈN/SỬA LIÊN KẾT ---");
                            console.log("1. Nội dung HTML TRƯỚC khi hộp thoại URL xuất hiện:", quillInstance.root.innerHTML);

                            // Lấy vùng chọn hiện tại
                            const range = quillInstance.getSelection(true);
                            let currentText = '';
                            if (range && range.length > 0) {
                                currentText = quillInstance.getText(range.index, range.length);
                            }

                            // Sử dụng prompt để lấy URL từ người dùng.
                            // `value` là boolean: true khi nhấn nút, false khi bỏ chọn link.
                            // `currentText` là văn bản được chọn, dùng để gợi ý trong prompt.
                            const url = prompt(`Nhập URL cho ${currentText ? '"' + currentText + '"' : 'liên kết'}:`, value === true ? '' : value);

                            if (url) {
                                // Nếu người dùng nhập URL, áp dụng định dạng liên kết
                                quillInstance.format('link', url);
                                console.log("2. Đã áp dụng liên kết với URL:", url);
                            } else if (value) {
                                // Nếu người dùng hủy hoặc nhập URL trống khi đang cố gắng chèn/sửa link
                                console.log("2. Người dùng đã hủy hoặc nhập URL trống. Không chèn liên kết.");
                                quillInstance.format('link', false); // Đảm bảo xóa định dạng nếu có
                            } else {
                                // Nếu value là false, nghĩa là người dùng muốn xóa định dạng liên kết
                                console.log("2. Đã xóa định dạng liên kết.");
                                quillInstance.format('link', false);
                            }

                            console.log("3. Nội dung HTML SAU khi xử lý liên kết (trong handler):", quillInstance.root.innerHTML);
                            console.log("--- KẾT THÚC QUÁ TRÌNH CHÈN/SỬA LIÊN KẾT (TRONG HANDLER) ---");
                        }
                    }
                }
            }
        });

        // Lắng nghe sự kiện text-change để log nội dung sau bất kỳ thay đổi nào của người dùng
        quill.on('text-change', function(delta, oldDelta, source) {
            if (source === 'user') {
                console.log("--- SỰ KIỆN TEXT-CHANGE (Do người dùng): ---");
                console.log("Nội dung HTML SAU CÙNG (từ text-change event):", quill.root.innerHTML);

                // Phân tích delta để biết loại thay đổi cụ thể
                const ops = delta.ops;
                ops.forEach(op => {
                    if (op.insert && op.attributes && op.attributes.link) {
                        console.log(`>>> PHÁT HIỆN: Chèn văn bản "${op.insert}" với liên kết: "${op.attributes.link}"`);
                    } else if (op.attributes && op.attributes.link === false) {
                        console.log(`>>> PHÁT HIỆN: Xóa định dạng liên kết.`);
                    } else if (op.delete) {
                        // Log khi có xóa nội dung
                        console.log(`>>> PHÁT HIỆN: Xóa ${op.delete} ký tự.`);
                    }
                });
                console.log("--- KẾT THÚC SỰ KIỆN TEXT-CHANGE ---");
            }
        });

        // Lắng nghe sự kiện selection-change để theo dõi vị trí con trỏ/vùng chọn
        quill.on('selection-change', function(range, oldRange, source) {
            if (range) {
                if (range.length === 0) {
                    // console.log("Con trỏ ở vị trí:", range.index);
                } else {
                    const text = quill.getText(range.index, range.length);
                    // console.log("Chọn văn bản:", text);
                }
            } else {
                // console.log("Không có lựa chọn nào.");
            }
        });
    }

    return { index };
}

export { testWysiwyg };