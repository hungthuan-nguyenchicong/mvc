// web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
import { quill } from "../quill";
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
    //const quill = this.quill;

    // Dispatch a custom event to signal that an image picker should be shown
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);
    //console.log(quillImageElement)

    // Add a one-time event listener to handle the image data
    // document.addEventListener('useImage', (e) => {
    //     const { imageUrl, imageAlt, imageCaption } = e.detail;

    //     const range = quill.getSelection(true);
    //     if (range && range.length >= 0) {
    //         // Use the safe and correct method to insert the custom blot
    //         quill.insertEmbed(
    //             range.index,
    //             'image', // Use the blotName you registered
    //             {
    //                 src: imageUrl,
    //                 alt: imageAlt,
    //                 caption: imageCaption
    //             },
    //             Quill.sources.USER
    //         );

    //         // Move the cursor after the newly inserted image
    //         quill.setSelection(range.index + 1, Quill.sources.SILENT);
    //     }
    // }, { once: true });
}

function clickUseImage(quillInstance) {
    // This event listener will be set up only once.
    document.addEventListener('useImage', (e) => {
        const {imageUrl, imageAlt = '', imageCaption = ''} = e.detail;
        const range = quillInstance.getSelection();
        // https://quilljs.com/docs/api#getselection;
        // https://quilljs.com/docs/api#insertembed
        const delta = quillInstance.insertEmbed(
            range.index,
            'image',
            {
                src: imageUrl,
                alt: imageAlt,
                caption: imageCaption
            }
        );
        //const range = quillInstance.getSelection();

        // if (range) {
        //     console.log(embed);
        //     if (range.length === 0) {
        //         console.log('User cursor is at index', range.index);
        //         console.log('User cursor is at index , length', range.index, range.length);

        //     } else {
        //         const text = quill.getText(range.index, range.length);
        //         console.log('User has highlighted: ', text);
        //     }
        // } else {
        //     console.log('User cursor is not in editor');
        // }

        // if (embed) {
        //     // https://quilljs.com/docs/api#setselection
        //     console.log(embed.length);
        //     const text = quillInstance.getText(embed);
        //     console.log(text)
        //     quillInstance.setSelection(range.index +1);
        // }
        //console.log(delta);
        if (delta && delta.ops && delta.ops.length > 0) {
            //console.log(delta.ops.insert);
            //console.log(delta.ops.flat(Infinity));
            //console.log(delta.ops[0].insert);
            // The length of a block embed in Quill's internal model is 1.
        // You can get this from the Delta.
        const insertedLength = delta.ops[0].insert.length || 1;
        console.log('Length of the inserted embed:', insertedLength);
            
        // Set the cursor position after the new embed.
        quillInstance.setSelection(range.index + insertedLength);
        }
    });

}

Quill.register(CustomImage, true);
export { handlerImage, clickUseImage };