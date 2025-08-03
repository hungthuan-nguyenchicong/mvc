## new CustomEvent

Adding active link functionality to your sidebar is a great idea for user experience. You can achieve this by having the `linkHandler` emit a custom event after a successful navigation. The sidebar can then listen for this event and update its active state.

Here's a step-by-step guide to implement this:

### Step 1: Modify `linkHandler` to Dispatch a Custom Event

First, you'll need to create and dispatch a **custom event** after `history.pushState` is called. This event will carry the new URL, allowing other parts of your application (like the sidebar) to react.

```javascript
// web-mvc/src/admin/core/adminRouterFrontend.js

// ... (existing code for routes and adminRouterFrontend)

function linkHandler() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            history.pushState(null, null, href);
            
            // Dispatch a custom event after a successful navigation
            // Pass the new href as part of the event's detail
            const navEvent = new CustomEvent('navigated', { detail: { href: href } });
            document.dispatchEvent(navEvent);

            adminRouterFrontend();
        }
    });

    window.addEventListener('popstate', (e) => {
        // Dispatch the same custom event for back/forward navigation
        const href = window.location.href;
        const navEvent = new CustomEvent('navigated', { detail: { href: href } });
        document.dispatchEvent(navEvent);
        
        adminRouterFrontend();
    });
}

linkHandler();
export { adminRouterFrontend };
```

-----

### Step 2: Create a Function to Handle Active Links

Next, in a separate file (or in the sidebar module itself), create a function that listens for the custom `Mapsd` event. When the event fires, this function will update the CSS class of the active link.

**Create a new file `web-mvc/src/admin/core/activeLinkHandler.js`:**

```javascript
// web-mvc/src/admin/core/activeLinkHandler.js

export function setupActiveLinkHandler() {
    const updateActiveLink = (currentUrl) => {
        // Remove the 'active' class from any currently active link
        const currentActive = document.querySelector('a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        // Find the link that matches the current URL and add the 'active' class
        const links = document.querySelectorAll('aside a');
        links.forEach(link => {
            // Check if the link's href matches the current URL or the base URL
            const linkHref = link.getAttribute('href');
            if (currentUrl.includes(linkHref) && linkHref !== '/admin/') {
                // For paths with query strings
                link.classList.add('active');
            } else if (currentUrl === linkHref) {
                // For exact matches (like '/admin/')
                link.classList.add('active');
            }
        });
    };

    // Listen for the custom 'navigated' event
    document.addEventListener('navigated', (e) => {
        const newUrl = e.detail.href;
        updateActiveLink(newUrl);
    });

    // Also run on initial page load to set the correct active link
    updateActiveLink(window.location.href);
}
```

-----

### Step 3: Import and Initialize the Handler

Finally, import and run the `setupActiveLinkHandler` function in your main entry file (e.g., `main.js`) to set up the event listener when the application starts.

```javascript
// web-mvc/src/admin/main.js (or your entry point)

import { adminRouterFrontend } from "./core/adminRouterFrontend";
import { setupActiveLinkHandler } from "./core/activeLinkHandler";

// Set up the active link handler
setupActiveLinkHandler();

// Run the router on initial load
adminRouterFrontend();
```

With these changes, your sidebar will now automatically update its active link whenever you navigate, whether by clicking a link or using the browser's back/forward buttons. You can then add a corresponding CSS rule in your `sidebar.scss` file:

```scss
/* web-mvc/src/admin/template/parts/sidebar.scss */

a.active {
    font-weight: bold;
    color: #007bff; /* Example active color */
    border-left: 3px solid #007bff;
    padding-left: 5px;
}
```