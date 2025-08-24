// web-mvc/src/admin/core/quill/quillImageManager.js

import Quill from "quill";

/**
 * Sets up a single, permanent listener to handle image insertion.
 * @param {Quill} quillInstance - The Quill editor instance.
 */
export function setupQuillImageManager(quillInstance) {
    // This event listener will be set up only once.
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;
        
        const range = quillInstance.getSelection(true);
        if (range && range.length >= 0) {
            quillInstance.insertEmbed(
                range.index, 
                'image', 
                {
                    src: imageUrl,
                    alt: imageAlt,
                    caption: imageCaption
                },
                Quill.sources.USER
            );
            quillInstance.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    });
}