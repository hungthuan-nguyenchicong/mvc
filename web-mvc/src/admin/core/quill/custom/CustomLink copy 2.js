// web-mvc/src/admin/core/quill/custom/CustomLink.js

import Quill from "quill";

const Inline = Quill.import('blots/inline');

class CustomLink extends Inline {
    static blotName = 'link';
    static tagName = 'a';

    static create(value) {
        let node = super.create();
        //node.removeAttribute('target');
        node.setAttribute('href', value);
        return node;
    }

    static formats(node) {
        return node.getAttribute(value)
    }
}

Quill.register(CustomLink, true);