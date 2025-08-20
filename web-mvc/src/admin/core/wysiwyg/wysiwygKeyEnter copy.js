// web-mvc/src/admin/core/wysiwyg/wysiwygKeyEnter.js

function wysiwygKeyEnter(content) {
    content.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            let currentNode = range.startContainer;
            if (currentNode.nodeType === Node.TEXT_NODE) {
                currentNode = currentNode.parentNode;
            }
            const currentParagraph = currentNode.closest('p, h1, h2, h3, h4, h5, h6');

            if (currentParagraph) {
                const newParagraph = document.createElement('p');
                newParagraph.innerHTML = '<br>';

                // Chèn thẻ p mới vào sau thẻ p hiện tại
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

export {wysiwygKeyEnter}