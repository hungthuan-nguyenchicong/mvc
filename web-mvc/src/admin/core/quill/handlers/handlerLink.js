// web-mvc/src/admin/core/quill/handlers/handlerLink.js


function handlerLink() {
    const value = prompt('Enter link URL');
    if (value) {
        this.quill.format('link', value);
    }
    this.quill.update();
}

export {handlerLink}