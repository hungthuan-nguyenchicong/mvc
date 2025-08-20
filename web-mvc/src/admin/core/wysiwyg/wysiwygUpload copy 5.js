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

function wysiwygUpload(toolbar) {
    //const toolbarElement = toolbar;
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

function insertImage(content) {
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption = 'Fig. - [Mô tả hình ảnh]' } = e.detail;
        console.log(imageUrl);

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            console.error("No selection found. Cannot insert image.");
            return;
        }

        const range = selection.getRangeAt(0);

        // 1. Create the <figure> element
        const figure = document.createElement('figure');

        // 2. Create the <img> element and set its attributes
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = imageAlt;
        img.style.width = '100%';

        // 3. Create the <figcaption> element and set its text
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = imageCaption;

        // 4. Append <img> and <figcaption> to <figure>
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // 5. Insert the <figure> element into the editor at the cursor position
        range.deleteContents(); // Delete any selected content
        range.insertNode(figure);

        // 6. Move the cursor after the newly inserted <figure> element
        const newRange = document.createRange();
        newRange.setStartAfter(figure);
        newRange.collapse(true);

        selection.removeAllRanges();
        selection.addRange(newRange);

        // Optional: Trigger an input event to notify the editor of the change
        //content.dispatchEvent(new Event('input', { bubbles: true }));
    });
}
// function insertImage(content) {
//     document.addEventListener('useImage', (e) => {
//         const { imageUrl, imageAlt, imageCaption = 'Fig. - [Mô tả hình ảnh]' } = e.detail;
//         console.log(imageUrl);

//         const selection = window.getSelection();
//         if (!selection || selection.rangeCount === 0) {
//             console.error("No selection found. Cannot insert image.");
//             return;
//         }

//         const range = selection.getRangeAt(0);

//         // 1. Create the <figure> element
//         const figure = document.createElement('figure');

//         // 2. Create the <img> element and set its attributes
//         const img = document.createElement('img');
//         img.src = imageUrl;
//         img.alt = imageAlt;
//         img.style.width = '100%';

//         // 3. Create the <figcaption> element and set its text
//         const figcaption = document.createElement('figcaption');
//         figcaption.textContent = imageCaption;

//         // 4. Append <img> and <figcaption> to <figure>
//         figure.appendChild(img);
//         figure.appendChild(figcaption);

//         // 5. Insert the <figure> element into the editor at the cursor position
//         range.deleteContents(); // Delete any selected content
//         range.insertNode(figure);

//         // 6. Move the cursor after the newly inserted <figure> element
//         const newRange = document.createRange();
//         newRange.setStartAfter(figure);
//         newRange.collapse(true);

//         selection.removeAllRanges();
//         selection.addRange(newRange);

//         // Optional: Trigger an input event to notify the editor of the change
//         content.dispatchEvent(new Event('input', { bubbles: true }));
//     });
// }

export { wysiwygUpload };