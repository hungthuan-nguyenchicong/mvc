// web-mvc/src/admin/core/wysiwyg/wysiwyg.js


function wysiwyg() {
    return render();
}

function render() {
    return /* html */ `
    <div class="toolbar">
        <button id="boldBtn">B</button>
    </div>
    <div id="content" class="content-area" contenteditable="true">
        Đây là một trình soạn thảo đơn giản. Hãy chọn một đoạn văn bản và nhấn nút "B".
    </div>
    `;
    
}

function logic() {
    const boldBtn = document.getElementById('boldBtn');
    const contentArea = document.getElementById('content');
    
    boldBtn.addEventListener('click', ()=>{
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
            // Lấy đối tượng Range đầu tiên (và thường là duy nhất) từ Selection
            const range = selection.getRangeAt(0);
            // Tạo một phần tử <strong> mới
            const boldNode = document.createElement('strong');
            // Bọc nội dung đã chọn vào trong thẻ <strong> mới
            range.surroundContents(boldNode);
        }
    });
    // Ngăn nút mất focus sau khi click để con trỏ vẫn nằm trong vùng soạn thảo
    boldBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
}

export {wysiwyg, logic}