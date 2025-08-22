## thêm tùy chỉnh upload

Since you've already created a custom "Upload" button and added it to the toolbar, you need to integrate your `imageQuill()` logic to be triggered by this button. The most effective way is to use a **delegated event listener** on the toolbar itself.

-----

### 1\. Update `quillInit()`

Modify the `quillInit()` function to trigger the logic from your `imageQuill` handler when the custom "Upload" button is clicked. You can do this by adding a click listener directly to the toolbar.

```javascript
// web-mvc/src/admin/core/quill/quillInit.js

// ... (other imports)
import { imageQuill } from "./handlers/imageQuill";

function quillInit() {
    // ... (Quill initialization code remains the same)
    const options = {
        modules: {
            toolbar: {
                container: [
                    // ... (existing buttons)
                    ['link', 'image', 'video'],
                ],
                handlers: {
                    'link': linkQuill,
                }
            }
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    };
    const quill = new Quill('#editor', options);

    // Get the toolbar and your custom button's container
    const toolbar = document.querySelector('.ql-toolbar.ql-snow');

    // Create a new span to hold your custom button
    const spanElement = document.createElement('span');
    spanElement.classList.add('ql-formats');

    // Create the custom upload button
    const uploadBtn = document.createElement('button');
    uploadBtn.innerHTML = 'Upload';
    uploadBtn.setAttribute('upload', '');

    // Append the button to the span and the span to the toolbar
    spanElement.appendChild(uploadBtn);
    if (toolbar) {
        toolbar.appendChild(spanElement);
    }
    
    // 2. Add a click event listener to your custom upload button
    uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Call the imageQuill handler, passing the Quill instance
        imageQuill.call({ quill: quill });
    });
    
    // Remove the old, unattached call to imageQuill()
    // imageQuill(); 
}

export { quillInit }
```

### 2\. Update `imageQuill()`

Your `imageQuill` function should **not** immediately listen for a `useImage` event. Instead, its purpose is to **initiate the upload process** (e.g., open a file dialog or a modal) and then set up a **one-time listener** for the `useImage` event, which will be dispatched after the image is successfully uploaded.

```javascript
// web-mvc/src/admin/core/quill/handlers/imageQuill.js

function imageQuill() {
    // Get the Quill instance from the context
    const quill = this.quill; 

    // A. The first time this function is called, it should
    // initiate the image upload process.
    // Example: Create an input element and click it programmatically
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', () => {
        // Here you would add your actual upload logic
        // For demonstration, let's assume a function `uploadFile()` exists
        const file = input.files[0];
        if (file) {
            // Your upload logic will eventually dispatch the 'useImage' event
            // when the upload is complete. For this example, we'll
            // dispatch it immediately with a placeholder URL.
            setTimeout(() => {
                const event = new CustomEvent('useImage', {
                    detail: {
                        imageUrl: URL.createObjectURL(file), // Placeholder
                        imageAlt: file.name,
                        imageCaption: 'Fig. - ' + file.name
                    }
                });
                document.dispatchEvent(event);
                document.body.removeChild(input);
            }, 500);
        }
    });

    // B. Set up the event listener for 'useImage'
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;
        
        // Get the current Quill selection
        const range = quill.getSelection();
        if (range) {
            // Use Quill API to insert the image
            quill.insertEmbed(range.index, 'image', imageUrl); 
            
            // NOTE: Quill's default behavior for 'image' is to insert just an <img> tag.
            // If you want to insert a custom <figure> and <figcaption>, you must use 
            // a custom Blot, as discussed in the previous response.
            // For now, this will insert a simple image.
        }
    }, { once: true }); // `once: true` ensures the listener is removed after being triggered once

    // C. Trigger the hidden file input
    input.click();
}

export { imageQuill }
```

This approach properly separates the concerns:

  * The **button** (`uploadBtn`) is responsible for triggering the upload process.
  * The **`imageQuill` function** is the handler that manages the upload process and inserts the content into the editor.
  * The **`useImage` event** acts as a communication channel between your upload logic and the editor logic.

## fix


// web-mvc/src/admin/core/quill/quillInit.js

// Import the Blot and the handlers
import Quill from 'quill';
import { linkQuill } from "./handlers/linkQuill";
import { imageQuill } from "./handlers/imageQuill";
import FigureBlot from "./formats/figure"; // 👈 Import your custom Blot

// 1. Register the custom Blot before Quill is instantiated
Quill.register(FigureBlot, true);

function quillInit() {
    const options = {
        // ... your Quill options
    };

    const quill = new Quill('#editor', options);
    
    // ... your custom button creation and event listener logic
}
export { quillInit }