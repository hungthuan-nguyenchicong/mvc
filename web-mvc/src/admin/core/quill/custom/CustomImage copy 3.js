// web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
const BlockEmbed = Quill.import('blots/block/embed');

class CustomImage extends BlockEmbed {
    // Use a unique name to avoid conflicts with Quill's default image blot
    static blotName = 'image';
    static tagName = 'figure';
    //static className = 'ql-figure';

    static create(value) {
        let node = super.create(value);

        // Ensure the value is an object with image data
        const { src, alt = '', caption = '' } = value;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '100%'; // Apply styling directly
        node.appendChild(img);

        if (caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = caption;
            node.appendChild(figcaption);
        }

        return node;
    }

    // Method to parse the blot's attributes from the HTML node
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

// Handler function to be called by the toolbar button
function handlerImage() {
    // 'this' refers to the toolbar handler context, which includes the Quill instance
    const quill = this.quill;

    // Dispatch a custom event to signal that an image picker should be shown
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);

    // Add a one-time event listener to handle the image data
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;

        const range = quill.getSelection(true);
        if (range) {
            // Use the safe and correct method to insert the custom blot
            quill.insertEmbed(
                range.index,
                'image', // Use the blotName you registered
                {
                    src: imageUrl,
                    alt: imageAlt,
                    caption: imageCaption
                },
                Quill.sources.USER
            );

            // Move the cursor after the newly inserted image
            quill.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    }, { once: true });
}

Quill.register(CustomImage, true);
export { handlerImage };