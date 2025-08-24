// web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
const BlockEmbed = Quill.import('blots/block/embed');

class CustomImage extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'figure';

    static create(value) {
        let node = super.create(value);
        const { src, alt = '', caption = '' } = value;
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '100%';
        node.appendChild(img);

        if (caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = caption;
            node.appendChild(figcaption);
        }
        return node;
    }

    static value(node) {
        const img = node.querySelector('img');
        const figcaption = node.querySelector('figcaption');
        return {
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            caption: figcaption ? figcaption.innerText : ''
        };
    }
}

function handlerImage() {
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);
}

function clickUseImage(quillInstance) {
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt = '', imageCaption = '' } = e.detail;
        const range = quillInstance.getSelection(true); // Get the selection with focus

        if (range) {
            // Check if the current location is inside a paragraph
            const [leaf] = quillInstance.getLeaf(range.index);

            // If the cursor is in the middle of a line, delete the existing text from the cursor to the end of the line
            // Then insert a new line before the embed
            if (leaf && leaf.domNode.tagName === 'P' && range.length === 0) {
                 const textBeforeCursor = quillInstance.getText(0, range.index);
                 const textAfterCursor = quillInstance.getText(range.index, quillInstance.getLength());
                 // Remove trailing text from the paragraph, insert the image, then add the text back on a new line.
                 // This ensures the image is on its own block line, which is how block embeds typically work.
                 const lineEndIndex = textBeforeCursor.lastIndexOf('\n') > 0 ? textBeforeCursor.lastIndexOf('\n') : 0;
                 quillInstance.deleteText(lineEndIndex, quillInstance.getLength(), Quill.sources.USER);
                 quillInstance.insertText(lineEndIndex, '\n', Quill.sources.USER);

            }
            
            // The `range.index` is the start position of the selection.
            // When an image is inserted, it occupies a single index in the document model.
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
            
            // Move the cursor to the end of the newly inserted image.
            // Since the image is a block embed, its length is 1.
            quillInstance.setSelection(range.index + 1, Quill.sources.USER);

            // For a better user experience, add a new line after the image.
            // This ensures the user can type text on a new line immediately.
            quillInstance.insertText(range.index + 1, '\n', Quill.sources.USER);
            quillInstance.setSelection(range.index + 2, Quill.sources.USER);
        }
    });
}

Quill.register(CustomImage, true);
export { handlerImage, clickUseImage };