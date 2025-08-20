// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

function wysiwyg() {
    return render();
}

// Hàm render: Tạo cấu trúc HTML ban đầu
function render() {
    return /* html */ `
    <div class="toolbar"></div>
    <div id="content" contenteditable="true" style="min-height: 200px">
        <p><br></p>
    </div>
    `;
}

// Hàm logic: Xử lý các sự kiện và tương tác
function logic() {
    const contentDiv = document.getElementById('content');

    contentDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            let currentNode = range.startContainer;
            // Nếu startContainer là một text node, lấy node cha của nó
            if (currentNode.nodeType === Node.TEXT_NODE) {
                currentNode = currentNode.parentNode;
            }

            // Tìm thẻ <p> gần nhất
            const currentParagraph = currentNode.closest('p');
            
            if (currentParagraph) {
                const newParagraph = document.createElement('p');
                newParagraph.innerHTML = '<br>';

                currentParagraph.after(newParagraph);
                
                const newRange = document.createRange();
                newRange.setStart(newParagraph, 0);
                newRange.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });
}

export { wysiwyg, logic };