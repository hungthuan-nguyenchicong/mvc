// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

function wysiwyg() {
    return render()
}

function render() {
    return /* html */ `
    <style>
      #content {
            border: 1px solid #ccc;
            padding: 10px;
            min-height: 100px;
            cursor: text;
      }

      #content:focus {
            outline: none;
            border-color: #007bff;
      }
</style>
<div class="toolbar">
      <div class="heading">
            <label for="heading">Choose a heading:</label>
            <select name="heading" id="heading">
                  <option value="p">p</option>
                  <option value="h1">h1</option>
                  <option value="h2">h2</option>
                  <option value="h3">h3</option>
            </select>
      </div>
</div>
<div id="content" contenteditable="true" style="min-height: 200px">
      <p><br></p>
</div>
    `;
}

function logic() {
    const contentDiv = document.getElementById('content');
    const toolbar = document.querySelector('.toolbar');
    const headingSelect = document.getElementById('heading');

    // Giữ nguyên logic cho phím Enter
    contentDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

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

                currentParagraph.after(newParagraph);

                const newRange = document.createRange();
                newRange.setStart(newParagraph, 0);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });

    // Thêm logic cập nhật dropdown khi con trỏ thay đổi
    contentDiv.addEventListener('keyup', updateHeadingDropdown);
    contentDiv.addEventListener('mouseup', updateHeadingDropdown);

    function updateHeadingDropdown() {
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
            // Nếu không tìm thấy, đặt mặc định là 'p' hoặc giá trị bạn muốn
            headingSelect.value = 'p';
        }
    }


    // Giữ nguyên logic xử lý khi chọn một giá trị từ dropdown
    headingSelect.addEventListener('change', function(event) {
        const newTag = event.target.value;
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let currentElement = range.startContainer;

        // Kiểm tra và lấy node cha nếu startContainer là TextNode
        if (currentElement.nodeType === Node.TEXT_NODE) {
            currentElement = currentElement.parentNode;
        }

        // Tìm thẻ cha gần nhất là p hoặc header
        while (currentElement && currentElement.nodeName !== 'P' && !currentElement.matches('h1, h2, h3, h4, h5, h6')) {
            currentElement = currentElement.parentNode;
        }

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


export { wysiwyg, logic };