import Quill from "quill";
const Link = Quill.import('formats/link');

class CustomLink extends Link {
    // This static method is called when a link is created
    static create(value) {
        let node = super.create(value);
        // This is the core logic: removing the 'target' attribute
        node.removeAttribute('target');
        return node;
    }
}
// This is the correct place to register the class with Quill.
Quill.register(CustomLink, true);

export { CustomLink };