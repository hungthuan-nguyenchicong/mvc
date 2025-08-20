// web-mvc/src/admin/core/wysiwyg/wysiwygHeadingDropdown.js

function wysiwygHeadingDropdown(toolbar, content) {
    const headingDropdow = document.createElement('div');
    headingDropdow.innerHTML = renderHeadingDropdown();
    toolbar.appendChild(headingDropdow);
    // select thay doi tagName
    const headingSelect = document.getElementById('wysiwygHeadingDropdown');
    changeHeading(headingSelect);
    // click content update Heading
    content.addEventListener('keyup', () => updateHeadingDropdown(headingSelect));
    content.addEventListener('mouseup', () => updateHeadingDropdown(headingSelect));
}

function renderHeadingDropdown() {
    return /* html */ `
    <select name="heading" id="wysiwygHeadingDropdown">
        <option value="p">Paragraph</option>
        <option value="h1">Heading H1</option>
        <option value="h2">Heading H2</option>
        <option value="h3">Heading H3</option>
        <option value="h4">Heading H4</option>
        <option value="h5">Heading H5</option>
        <option value="h6">Heading H6</option>
    </select>
    `;
}

function changeHeading(headingSelect) {
    //const headingSelect = document.getElementById('wysiwygHeadingDropdown');
    headingSelect.addEventListener('change', (e) => {
        const newTag = e.target.value;
        const selection = window.getSelection();
        // Corrected typo and logic: Only proceed if there is a valid selection range.
        if (!selection || selection.rangeCount === 0) {
            console.error("No selection found. Cannot insert image.");
            return;
        }
        const range = selection.getRangeAt(0);
        let currentElement = range.startContainer;
        //console.log(currentElement)
        // Kiểm tra và lấy node cha nếu startContainer là TextNode
        if (currentElement.nodeType === Node.TEXT_NODE) {
            currentElement = currentElement.parentNode;
        }
        // Tìm thẻ cha gần nhất là p hoặc header
        while (currentElement && currentElement.nodeName !== 'P' && !currentElement.matches('h1, h2, h3, h4, h5, h6')) {
            currentElement = currentElement.parentNode;
        }
        console.log(currentElement)

        if (currentElement) {
            const content = currentElement.innerHTML;
            const newElement = document.createElement(newTag);
            newElement.innerHTML = content;

            currentElement.replaceWith(newElement);

            const newRange = document.createRange();
            newRange.selectNodeContents(newElement);
            newRange.collapse(false);

            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    });
}

function updateHeadingDropdown(headingSelect) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let currentElement = range.startContainer;

    // Tìm thẻ cha gần nhất là p hoặc header
    if (currentElement.nodeType === Node.TEXT_NODE) {
        currentElement = currentElement.parentNode;
    }

    const parentTag = currentElement.closest('p, h1, h2, h3, h4, h5, h6');
    if (parentTag) {
        headingSelect.value = parentTag.tagName.toLowerCase();
    } else {
        headingSelect.value = 'p';
    }
}
export {wysiwygHeadingDropdown}