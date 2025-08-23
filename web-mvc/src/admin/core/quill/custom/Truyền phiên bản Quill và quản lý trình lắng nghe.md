## Truyền phiên bản Quill và quản lý trình lắng nghe

The reason you are seeing two images inserted after uploading one and then closing and reopening the modal is a common issue with **event listeners**.

Your `handlerImage` function adds an event listener to the `document.body` every time it's called.  This function is called when you click the image toolbar button.

Here's the sequence of events that leads to the problem:

1.  You click the image button for the first time.
2.  The `handlerImage` function runs.
3.  It dispatches `quillImage` to open your image picker modal.
4.  It adds a `useImage` event listener to `document.body` to wait for the image data. This listener has `{ once: true }`, so it will be removed after it fires.
5.  You upload an image. The `useImage` event fires, the image is inserted, and the listener is removed.

Now, let's look at what happens when you repeat the process without a page refresh:

1.  You click the image button for the second time.
2.  The `handlerImage` function runs again.
3.  It dispatches a **second** `quillImage` event.
4.  It adds another, **new** `useImage` event listener.
5.  You upload an image. The `useImage` event fires.
6.  The **new** listener you just added inserts the image.
7.  The modal closes, but for some reason, the original `useImage` event from the first interaction might not have been fully cleaned up, or the event is re-triggered on the second go, causing the first image to be inserted again.

The root of the issue is that the event listener isn't being properly managed or is being added multiple times. The solution is to ensure the listener is either added only once or that the previous listener is properly removed before a new one is added.

-----

### Cách khắc phục

There are two primary ways to fix this. The best approach is to pass the Quill instance directly to the handler and manage the event listener more explicitly.

#### 1\. (Recommended) Pass the Quill instance and manage the listener within your modal handler.

Instead of your `handlerImage` function doing everything, have it just fire the event. Then, your image picker modal's code should be responsible for listening for and handling the `quillImage` event. This way, the listener isn't tied to the toolbar button click.

**`CustomImage.js` (Simplified)**

```javascript
// This file only registers the custom blot and exports the handler
import Quill from "quill";
const BlockEmbed = Quill.import('blots/block/embed');

class CustomImage extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'figure';

    // ... create and value methods are the same ...
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

// Just a simple function to fire the event
function handlerImage() {
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);
}

Quill.register(CustomImage, true);
export { handlerImage };
```

**`ImagePickerModal.js` (Pseudo-code)**

```javascript
import Quill from "quill";

// This is your separate modal code
document.body.addEventListener('quillImage', (e) => {
    // Show your modal
    showImageModal();
});

// A function inside your modal that inserts the image
function insertImageIntoQuill(quill, imageUrl, imageAlt, imageCaption) {
    const range = quill.getSelection(true);
    if (range) {
        quill.insertEmbed(
            range.index, 
            'image', 
            { src: imageUrl, alt: imageAlt, caption: imageCaption },
            Quill.sources.USER
        );
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
}
```

This approach is much cleaner because the `handlerImage` function is no longer responsible for managing the state of the event listener. The modal itself takes care of inserting the image.

#### 2\. (Simpler) Remove the listener before adding it again.

If you cannot refactor the code as shown above, a simpler fix is to remove the old listener before adding a new one.

```javascript
// Create a named function for the event listener so you can remove it.
function useImageHandler(e) {
    const quill = this.quill; // 'this' might be lost, so let's pass it
    const { imageUrl, imageAlt, imageCaption } = e.detail;
    const range = quill.getSelection(true);
    if (range) {
        quill.insertEmbed(
            range.index, 
            'image', 
            { src: imageUrl, alt: imageAlt, caption: imageCaption },
            Quill.sources.USER
        );
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    // Remove the listener after it fires, or when the modal closes
    document.body.removeEventListener('useImage', useImageHandler);
}

function handlerImage() {
    const quill = this.quill;
    
    // First, remove any existing listeners to prevent duplicates
    document.removeEventListener('useImage', useImageHandler);
    
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);

    // Now, add the new listener
    document.addEventListener('useImage', useImageHandler.bind({quill: quill}), { once: true });
}
```

This second method is more verbose and can be tricky to get right, which is why the first approach is superior. It correctly separates the concerns of the toolbar button and the image picker modal.