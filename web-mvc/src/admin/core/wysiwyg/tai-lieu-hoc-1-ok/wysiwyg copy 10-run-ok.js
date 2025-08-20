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
        cursor: text; /* Đổi con trỏ chuột thành hình chữ I */
        }

        #content:focus {
        outline: none; /* Bỏ đường viền mặc định của trình duyệt khi focus */
        border-color: #007bff;
        }
    </style>
    <div class="toolbar">
        <div class="heading">
            <label for="heading">Choose a heading:</label>
            <select name="heading" id="heading">
                <option value="h1">h1</option>
                <option value="h2">h2</option>
                <option value="h3">h3</option>
                <option value="p">p</option>
            </select>
        </div>
        <button type="button" data-tag="h1">H1</button>
        <button type="button" data-tag="h2">H2</button>
        <button type="button" data-tag="h3">H3</button>
        <button type="button" data-tag="p">P</button>
    </div>
    <div id="content" contenteditable="true" style="min-height: 200px">
        <p><br></p>
    </div>
    `;
}

function logic() {
    const contentDiv = document.getElementById('content');
    const toolbar = document.querySelector('.toolbar');
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

            const currentParagraph = currentNode.closest('p, h1, h2, h3, h4, h5, h6');

            // Tìm thẻ <p> gần nhất
            //const currentParagraph = currentNode.closest('p');

            if (currentParagraph) {

                const newParagraph = document.createElement('p');
                newParagraph.innerHTML = '<br>';

                // Chèn thẻ p mới vào sau thẻ p hiện tại
                currentParagraph.after(newParagraph);
                
                // Di chuyển con trỏ vào đầu thẻ p mới
                const newRange = document.createRange();
                newRange.setStart(newParagraph, 0);
                newRange.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    });

    // Logic xử lý khi nhấn các nút trên toolbar
    toolbar.addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (!button) return;

        const newTag = button.dataset.tag;
        if (!newTag) return;

        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let currentElement = range.startContainer;

        // --- Sửa lỗi tại đây ---
        // Kiểm tra và lấy node cha nếu startContainer là TextNode
        if (currentElement.nodeType === Node.TEXT_NODE) {
            currentElement = currentElement.parentNode;
        }
        // --- Hết phần sửa lỗi ---

        // Tìm thẻ cha gần nhất là p hoặc header
        while (currentElement && currentElement.nodeName !== 'P' && !currentElement.matches('h1, h2, h3, h4, h5, h6')) {
            currentElement = currentElement.parentNode;
        }

        if (currentElement) {
            const content = currentElement.innerHTML;
            const newElement = document.createElement(newTag);
            newElement.innerHTML = content;
            
            // Thay thế thẻ hiện tại bằng thẻ mới
            currentElement.replaceWith(newElement);

            // Di chuyển con trỏ vào thẻ mới
            const newRange = document.createRange();
            newRange.selectNodeContents(newElement);
            newRange.collapse(true);

            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    });
}

export { wysiwyg, logic };