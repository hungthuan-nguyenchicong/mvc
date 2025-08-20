// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

/**
 * Hàm chính để khởi tạo và trả về HTML của trình soạn thảo WYSIWYG.
 * @returns {string} Chuỗi HTML cho trình soạn thảo.
 */
function wysiwyg() {
    return render();
}

/**
 * Hàm này tạo ra cấu trúc HTML cho trình soạn thảo.
 * Bao gồm thanh công cụ và vùng soạn thảo chính.
 * @returns {string} Chuỗi HTML.
 */
function render() {
    return /* html */ `
        <div class="toolbar flex space-x-2 p-2 bg-gray-200 rounded-t-lg">
            <button id="boldBtn"
                    class="p-2 bg-gray-300 hover:bg-gray-400 rounded-md font-bold text-gray-700 transition duration-200"
                    title="In đậm">
                B
            </button>
            <button id="wrapParagraphBtn"
                    class="p-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-700 transition duration-200"
                    title="Bọc các đoạn văn bản trong thẻ <p>">
                Bọc đoạn văn
            </button>
        </div>
        <div id="content"
             class="content-area p-4 border border-gray-300 rounded-b-lg min-h-[200px] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
             contenteditable="true">
            <p>Đây là một trình soạn thảo đơn giản.</p>
            <p>Hãy chọn một đoạn văn bản và nhấn nút "B" để in đậm.</p>
            <br>
            Bạn có thể viết nhiều dòng và nhấn nút "Bọc đoạn văn" hoặc click ra ngoài để xem kết quả bọc thẻ P.
            <br>
            <br>
            Đây là một dòng không có thẻ p.
            <br>
            <br>
            <p>Đây là một đoạn đã có sẵn thẻ p.</p>
        </div>
    `;
}

/**
 * Hàm này chứa tất cả logic tương tác cho trình soạn thảo.
 * Nó thiết lập các trình lắng nghe sự kiện cho các nút và vùng nội dung.
 */
function logic() {
    // Lấy tham chiếu đến các phần tử HTML
    const boldBtn = document.getElementById('boldBtn');
    const wrapParagraphBtn = document.getElementById('wrapParagraphBtn');
    const contentArea = document.getElementById('content');

    /**
     * Hàm bọc nội dung văn bản vào thẻ <p> nếu nó chưa được bọc.
     * Nó xử lý từng Node con của contentArea.
     * @param {HTMLElement} element - Phần tử HTML chứa nội dung cần bọc (ví dụ: contentArea).
     */
    function wrapParagraphsInElement(element) {
        const nodesToProcess = Array.from(element.childNodes);
        let processedContent = '';

        nodesToProcess.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Xử lý các node văn bản
                const text = node.textContent.trim();
                if (text) { // Chỉ bọc nếu có nội dung
                    processedContent += `<p>${text}</p>`;
                } else if (node.textContent.includes('\n')) {
                    // Xử lý các dòng trống từ việc nhấn Enter trong contenteditable
                    processedContent += '<br>';
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Nếu là phần tử HTML, kiểm tra xem nó có phải là <p> hợp lệ không
                // Nếu không phải <p>, hoặc <br>, hãy chuyển đổi nội dung của nó thành <p>
                // hoặc giữ nguyên nếu nó là các thẻ định dạng khác (strong, em,...)
                if (node.tagName.toLowerCase() === 'p') {
                    processedContent += node.outerHTML; // Giữ nguyên thẻ p đã có
                } else if (node.tagName.toLowerCase() === 'br') {
                    processedContent += node.outerHTML; // Giữ nguyên thẻ br
                }
                 else {
                    // Đối với các thẻ khác (strong, em, div...), hãy lấy innerHTML của chúng
                    // và bọc trong <p> nếu chúng có nội dung không phải là khoảng trắng.
                    // Cần cẩn thận ở đây để không phá vỡ cấu trúc phức tạp.
                    // Đối với ví dụ đơn giản này, ta sẽ bọc lại hoặc giữ nguyên nếu đã là block element
                    const innerText = node.textContent.trim();
                    if (innerText) {
                         // Nếu node là một inline element và có nội dung, bọc nó vào p
                        if (['b', 'strong', 'i', 'em', 'span', 'a'].includes(node.tagName.toLowerCase())) {
                            processedContent += `<p>${node.outerHTML}</p>`;
                        } else {
                            // Đối với các block element khác, giữ nguyên hoặc xử lý nội dung bên trong
                            // Đối với yêu cầu cơ bản, ta sẽ cố gắng bọc nếu nội dung có thể đứng độc lập
                            processedContent += `<p>${node.innerHTML}</p>`; // Có thể cần logic phức tạp hơn ở đây
                        }
                    } else {
                        // Nếu là một thẻ trống hoặc không có nội dung văn bản đáng kể, có thể bỏ qua hoặc xử lý cụ thể
                        processedContent += node.outerHTML; // Hoặc bỏ qua nếu không muốn giữ thẻ trống
                    }
                }
            }
            // Bỏ qua các loại node khác (comment, document type, v.v.)
        });
        element.innerHTML = processedContent;
    }


    // 1. Logic cho nút "B" (in đậm)
    boldBtn.addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const boldNode = document.createElement('strong');
            // Sử dụng document.execCommand để áp dụng định dạng.
            // Đây là cách chuẩn hơn cho các thao tác định dạng cơ bản trong contenteditable.
            document.execCommand('bold', false, null);
            // range.surroundContents(boldNode); // Cách này có thể gây ra lỗi nếu selection không nguyên vẹn
        }
    });

    // Ngăn nút "B" mất focus sau khi click để con trỏ vẫn nằm trong vùng soạn thảo
    boldBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });

    // 2. Logic cho nút "Bọc đoạn văn"
    wrapParagraphBtn.addEventListener('click', () => {
        wrapParagraphsInElement(contentArea);
        // Sau khi bọc, đặt lại con trỏ vào cuối vùng soạn thảo
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(contentArea);
        range.collapse(false); // Đặt con trỏ vào cuối
        selection.removeAllRanges();
        selection.addRange(range);
        contentArea.focus(); // Đảm bảo vùng soạn thảo vẫn có focus
    });

    // 3. Logic khi vùng soạn thảo bị mất focus (blur event)
    contentArea.addEventListener('blur', () => {
        wrapParagraphsInElement(contentArea);
    });
}

// Xuất các hàm để có thể sử dụng ở các module khác
export { wysiwyg, logic };
