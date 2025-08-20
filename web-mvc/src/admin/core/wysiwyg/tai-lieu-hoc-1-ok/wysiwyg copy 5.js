// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

function wysiwyg() {
    return render()
}

function render() {
    return /* html */ `
    <div class="toolbar"></div>
    <div id="content" contenteditable="true" style="min-height: 200px">
        <p><br></p>
    </div>
    `;
}

function logic() {
    const contentDiv = document.getElementById('content');

    // Sự kiện khi người dùng click vào
    contentDiv.addEventListener('click', function() {
        // Lấy thẻ <p> cuối cùng
        const lastP = contentDiv.querySelector('p:last-child');
        
        // Nếu thẻ <p> cuối cùng rỗng, thêm &nbsp; và đặt con trỏ
        if (lastP && lastP.textContent.trim() === '') {
            lastP.innerHTML = '&nbsp;';
            
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStart(lastP.childNodes[0], 1); // Đặt con trỏ sau &nbsp;
            range.collapse(true);
            
            selection.removeAllRanges();
            selection.addRange(range);
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
                newParagraph.innerHTML = '<br>'; // Chèn <br> để tạo không gian

                // Kiểm tra xem có đang ở cuối dòng không
                const atEndOfLine = range.endOffset === currentParagraph.textContent.length;

                // Nếu đang ở cuối dòng, tách nội dung và chèn <p> mới
                if (atEndOfLine) {
                    currentParagraph.after(newParagraph);
                } else {
                    // Nếu ở giữa dòng, tách và chuyển phần còn lại xuống dòng mới
                    const remainingText = range.startContainer.textContent.substring(range.startOffset);
                    newParagraph.textContent = remainingText;
                    range.startContainer.textContent = range.startContainer.textContent.substring(0, range.startOffset);
                    currentParagraph.after(newParagraph);
                }

                // Di chuyển con trỏ vào đầu thẻ <p> mới
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