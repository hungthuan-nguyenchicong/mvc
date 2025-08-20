// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

function wysiwyg() {
    return render()
}

function render() {
    return /* html */ `
    <div class="toolbar"></div>
    <div id="content" contenteditable="true" style="min-height: 200px">
        <p>&nbsp;</p>
    </div>
    `;
}

function logic() {
    const contentDiv = document.getElementById('content');

    // Lắng nghe sự kiện input để xóa &nbsp; khi bắt đầu nhập
    contentDiv.addEventListener('input', function(event) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        let currentNode = range.startContainer;

        // Nếu currentNode là một text node và đang chứa &nbsp;
        if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim() === '') {
            const parent = currentNode.parentNode;
            if (parent.innerHTML === '&nbsp;') {
                // Xóa &nbsp; và thay thế bằng một ký tự rỗng
                parent.innerHTML = '';
                
                // Đặt lại con trỏ vào vị trí đầu tiên
                const newRange = document.createRange();
                newRange.setStart(parent, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });

    contentDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            let currentNode = range.startContainer;
            if (currentNode.nodeType === Node.TEXT_NODE) {
                currentNode = currentNode.parentNode;
            }

            const currentParagraph = currentNode.closest('p');

            if (currentParagraph) {
                const newParagraph = document.createElement('p');
                newParagraph.innerHTML = '&nbsp;';

                currentParagraph.after(newParagraph);
                
                const newRange = document.createRange();
                newRange.setStart(newParagraph.firstChild, 1);
                newRange.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });
}

export { wysiwyg, logic };