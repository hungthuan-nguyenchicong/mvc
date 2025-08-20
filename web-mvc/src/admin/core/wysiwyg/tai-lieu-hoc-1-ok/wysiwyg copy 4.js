// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

function wysiwyg() {
    return render();
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

    contentDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // Get the node where the cursor is currently located
            let currentNode = range.startContainer;

            // Check if the current node is a text node
            if (currentNode.nodeType === Node.TEXT_NODE) {
                // If it's a text node, get its parent element
                currentNode = currentNode.parentNode;
            }

            // Now, safely use closest() on an element node
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