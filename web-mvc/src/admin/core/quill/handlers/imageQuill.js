// web-mvc/src/admin/core/quill/handlers/imageQuill.js

function imageQuill() {
    const quill = this.quill;
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption = 'abc' } = e.detail;
        
        const range = quill.getSelection(true);
        if (range) {
            // Thay vì insertEmbed, dùng clipboard.dangerouslyPasteHTML
            const html = `<figure><img src="${imageUrl}" alt="${imageAlt}" style="width:100%"><figcaption>${imageCaption}</figcaption></figure>`;
            quill.clipboard.dangerouslyPasteHTML(range.index, html);
        }
    }, { once: true });
}
export { imageQuill };