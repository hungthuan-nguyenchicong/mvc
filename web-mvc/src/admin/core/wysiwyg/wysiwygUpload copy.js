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
        const { imageUrl, imageAlt } = e.detail;
        console.log(imageUrl);

        const selection = window.getSelection();
        // Corrected typo and logic: Only proceed if there is a valid selection range.
        if (!selection || selection.rangeCount === 0) {
            console.error("No selection found. Cannot insert image.");
            return;
        }

        const range = selection.getRangeAt(0);
        range.deleteContents(); // Deletes any selected content

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = imageAlt;

        // Corrected: Append the img element directly to the fragment.
        const fragment = document.createDocumentFragment();
        fragment.appendChild(img);

        range.insertNode(fragment); // Insert fragment at cursor position

        // Di chuyển con trỏ về sau thẻ vừa chèn
        // Corrected: The last node is the image itself.
        const newRange = document.createRange();
        newRange.setStartAfter(img);
        newRange.collapse(true);

        selection.removeAllRanges();
        selection.addRange(newRange);
    });
}

export { wysiwygUpload };