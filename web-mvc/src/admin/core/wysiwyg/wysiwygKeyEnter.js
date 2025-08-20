// web-mvc/src/admin/core/wysiwyg/wysiwygKeyEnter.js

function wysiwygKeyEnter(content) {
    content.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const selection = window.getSelection();
            //if (!selection.rangeCount) return;
            if (!selection || selection.rangeCount === 0) {
                console.error("No selection found. Cannot insert image.");
                return;
            }

            const range = selection.getRangeAt(0);

            // Get the container of the cursor.
            // If it's a Text Node, use its parent Element.
            let container = range.startContainer;
            if (container.nodeType === Node.TEXT_NODE) {
                container = container.parentNode;
            }

            // Find the closest block-level element (p, h1, etc.) or figure.
            const currentBlock = container.closest('p, h1, h2, h3, h4, h5, h6, figure');

            // Create the new paragraph element.
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = '<br>'; // Ensures cursor visibility

            if (currentBlock) {
                // If the current block is a figure, insert the new paragraph after it.
                if (currentBlock.nodeName === 'FIGURE') {
                    currentBlock.after(newParagraph);
                } else {
                    // Otherwise, split the current paragraph.
                    // This logic is more complex than a simple 'after' and should
                    // handle splitting text nodes and moving remaining content.
                    // For a basic solution, 'after' works but might not handle all cases.
                    currentBlock.after(newParagraph);
                }
            } else {
                // If no block element is found (e.g., cursor is in the content div itself),
                // append the new paragraph to the content div.
                content.appendChild(newParagraph);
            }

            // Move the cursor to the new paragraph.
            const newRange = document.createRange();
            newRange.setStart(newParagraph, 0);
            newRange.collapse(true);

            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    });
}

export { wysiwygKeyEnter };