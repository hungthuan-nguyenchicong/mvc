// web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
import { BlockEmbed } from "quill/blots/block";

class CustomImage extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'figure';

    static create(value) {
        let node =  super.create();
        //node.setAttribute('href', value);
        return node;
    }

    static formats(node) {
        return node.imageData()
    }
}

function imageData() {
    const quill = this.quill;
    document.activeElement('useImage', () => {
        document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption = 'abc' } = e.detail;
        
        const range = quill.getSelection(true);
        if (range) {
            // Thay vì insertEmbed, dùng clipboard.dangerouslyPasteHTML
            const html = `<figure><img src="${imageUrl}" alt="${imageAlt}" style="width:100%"><figcaption>${imageCaption}</figcaption></figure>`;
            quill.clipboard.dangerouslyPasteHTML(range.index, html);
        }
    }, { once: true });
    })
}

function handlerImage() {
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);
}

Quill.register(CustomImage, true);
export {handlerImage}