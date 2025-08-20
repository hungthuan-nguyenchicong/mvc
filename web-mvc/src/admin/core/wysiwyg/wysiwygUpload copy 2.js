// web-mvc/src/admin/core/wysiwyg/wysiwygUpload.js

/**
 * 
 * @param {*} toolbar 
 * @param {*} content 
<figure>
  <img src="pic_trulli.jpg" alt="Trulli" style="width:100%">
  <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption>
</figure>

 */

function wysiwygUpload(toolbar, content) {
    const upload = document.createElement('div');
    upload.innerHTML = renderUpload();
    toolbar.appendChild(upload);

    // This listener should be attached to a button, not called directly.
    // The `content` parameter is also unused, which may be a bug.
    // Assuming `insertImage` is meant to be called in a different way,
    // the corrected version of the `insertImage` function is shown below.
    insertImage(); 
}

function renderUpload() {
    return /* html */ `
    <button id="wysiwygUpload" upload>Upload Image</button>
    `;
}

function insertImage() {
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption = 'Fig. - [Mô tả hình ảnh]' } = e.detail;
        console.log(imageUrl);

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            console.error("No selection found. Cannot insert image.");
            return;
        }

        const range = selection.getRangeAt(0);
        range.deleteContents(); // Xóa nội dung được chọn

        // 1. Tạo thẻ <figure>
        const figure = document.createElement('figure');
        figure.style.width = '100%';

        // 2. Tạo thẻ <img> và gán thuộc tính
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = imageAlt;
        img.style.width = '100%';

        // 3. Tạo thẻ <figcaption>
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = imageCaption;

        // 4. Gắn <img> và <figcaption> vào <figure>
        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        // 5. Chèn thẻ <figure> vào trình soạn thảo tại vị trí con trỏ
        const fragment = document.createDocumentFragment();
        fragment.appendChild(figure);
        range.insertNode(fragment);

        // 6. Di chuyển con trỏ sau thẻ <figure> vừa chèn
        const newRange = document.createRange();
        newRange.setStartAfter(figure);
        newRange.collapse(true);

        selection.removeAllRanges();
        selection.addRange(newRange);
    });
}

export { wysiwygUpload };