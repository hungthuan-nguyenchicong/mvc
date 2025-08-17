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
                newParagraph.innerHTML = '&nbsp;';

                // Chèn thẻ p mới vào sau thẻ p hiện tại
                currentParagraph.after(newParagraph);
                
                // Di chuyển con trỏ vào đầu thẻ p mới
                const newRange = document.createRange();
                newRange.setStart(newParagraph, 1);
                newRange.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });
}

export { wysiwyg, logic };