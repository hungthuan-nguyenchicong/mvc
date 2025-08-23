// web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
import { BlockEmbed } from "quill/blots/block";

class CustomImage extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'figure';

    // static create(value) {
    //     let node =  super.create();
    //     //node.setAttribute('href', value);
    //     return node;
    // }

    // static formats(node) {
    //     return node.imageData()
    // }
    static create(value) {
        let node = super.create(value);
        
        // This value should be an object with the image data
        const { src, alt = '', caption = '' } = value;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        node.appendChild(img);

        if (caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = caption;
            node.appendChild(figcaption);
        }

        return node;
    }

    // Returns a value that can be passed to static create()
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

// function imageData() {
//     const quill = this.quill;
//     document.activeElement('useImage', () => {
//         document.addEventListener('useImage', (e) => {
//         const { imageUrl, imageAlt, imageCaption = 'abc' } = e.detail;
        
//         const range = quill.getSelection(true);
//         if (range) {
//             // Thay vì insertEmbed, dùng clipboard.dangerouslyPasteHTML
//             const html = `<figure><img src="${imageUrl}" alt="${imageAlt}" style="width:100%"><figcaption>${imageCaption}</figcaption></figure>`;
//             quill.clipboard.dangerouslyPasteHTML(range.index, html);
//         }
//     }, { once: true });
//     })
// }

// function handlerImage() {
//     const quillImageElement = new CustomEvent('quillImage');
//     document.body.dispatchEvent(quillImageElement);
// }
// Function to handle the image button click
function handlerImage() {
    const quill = this.quill;
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);

    // Add a one-time event listener to handle the image data from another part of the application
    // document.addEventListener('useImage', (e) => {
    //     const { imageUrl, imageAlt, imageCaption } = e.detail;
    //     const range = quill.getSelection(true);

    //     if (range) {
    //         // Insert the custom blot with the image data
    //         quill.insertEmbed(range.index, 'customImage', {
    //             src: imageUrl,
    //             alt: imageAlt,
    //             caption: imageCaption
    //         }, Quill.sources.USER);

    //         // Move the cursor after the inserted blot
    //         quill.setSelection(range.index + 1, Quill.sources.SILENT);
    //     }
    // }, { once: true });
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;
        
        const range = quill.getSelection(true);
        if (range) {
            // Thay vì insertEmbed, dùng clipboard.dangerouslyPasteHTML
            const html = `<figure><img src="${imageUrl}" alt="${imageAlt}" style="width:100%"><figcaption>${imageCaption}</figcaption></figure>`;
            quill.clipboard.dangerouslyPasteHTML(range.index, html);
        }
    }, { once: true });
}


Quill.register(CustomImage, true);
export {handlerImage}