## quill-custom-modules.js

To organize your Quill.js customizations into a separate file and import them, you'll need to use JavaScript modules. This approach keeps your code clean, reusable, and easier to maintain.

## Steps to Implement

### Step 1: Create a Custom JavaScript File

First, create a new file, for example, `quill-custom-modules.js`, to hold your custom code. This file will contain the custom `Link` class and the registration logic for Quill.

```javascript
// quill-custom-modules.js

import Quill from 'quill';

const Link = Quill.import('formats/link');

class CustomLink extends Link {
    static create(value) {
        let node = super.create(value);
        // Remove the 'target' attribute to prevent opening in a new tab
        node.removeAttribute('target');
        return node;
    }
}

// Register the custom blot
Quill.register(CustomLink, true);

// Export a function to handle the click event, making it reusable
export function handleLinkClick(editorElement) {
    editorElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            e.stopPropagation();

            // Find the link input within the Quill toolbar
            // Note: The specific selector might need adjustment depending on your Quill version and toolbar setup
            const linkInput = editorElement.querySelector('.ql-container .ql-tooltip input[type="text"]');
            
            if (linkInput) {
                console.log(linkInput.value);
            }
        }
    });
}
```

-----

### Step 2: Import and Use in Your Main Application File

In your main file (e.g., `main.js` or `index.js`), you can now import and use the custom modules.

```javascript
// main.js

import Quill from 'quill';
import { handleLinkClick } from './quill-custom-modules.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill editor
    const editorElement = document.getElementById('editor');
    if (editorElement) {
        const quill = new Quill(editorElement, {
            theme: 'snow', // or 'bubble'
            modules: {
                toolbar: [
                    ['link']
                ]
            }
        });

        // Call the exported function to handle the link click event
        handleLinkClick(editorElement);
    }
});
```

-----

### Step 3: Ensure Your HTML File is Set Up Correctly

Make sure your HTML file correctly loads the scripts as modules. This is crucial for the `import` and `export` statements to work.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quill Custom Link</title>
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
</head>
<body>
    <div id="editor">
        <p>Hello World!</p>
        <p><a href="https://example.com" rel="noopener noreferrer">This is a link</a></p>
    </div>

    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    
    <script type="module" src="main.js"></script>

</body>
</html>
```

### Explanation

  * **`import Quill from 'quill';`**: This line imports the Quill library into your custom module file. This is necessary so you can access `Quill.import` and `Quill.register`.
  * **`export function handleLinkClick(...)`**: By wrapping your event listener code in an exported function, you make it modular and reusable. Instead of placing the event listener directly in the custom file, you can now call this function from your main application file, passing in the editor element.
  * **`type="module"`**: The `<script type="module" src="main.js"></script>` tag in your HTML file tells the browser to treat `main.js` as a JavaScript module. This enables `import` and `export` statements.

This modular approach makes your code cleaner and more scalable, allowing you to manage and extend Quill's functionality more effectively.