// main.js
import './style.scss'; // Assuming this imports global styles
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { Router } from './core/Router.js';

console.log("main.js: Script started loading.");

document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOMContentLoaded event fired.");

    const app = document.getElementById('app');

    if (!app) {
        console.error("main.js: Element with ID 'app' not found. Please ensure your HTML has <div id='app'></div>.");
        return; // Stop execution if the app container is missing
    }
    console.log("main.js: 'app' element found.");

    // 1. Initialize and render the Header
    const headerInstance = new Header();
    const headerElement = headerInstance.render();
    app.appendChild(headerElement);
    console.log("main.js: Header rendered.");

    // 2. Initialize and render the Sidebar
    const sidebarInstance = new Sidebar();
    const sidebarElement = sidebarInstance.render();
    app.appendChild(sidebarElement); // Append the sidebar to the main app container
    console.log("main.js: Sidebar rendered.");

    // 3. Attach Sidebar's internal event listeners (for its own UI interactions, if any)
    sidebarInstance.addEventListeners();
    console.log("main.js: Sidebar event listeners attached.");

    // 4. Initialize the Router
    // This is the key change: Create the router instance,
    // but DON'T let its init() method trigger the initial route change YET.
    // We'll move the initial trigger to a public method.
    console.log("main.js: Creating Router instance...");
    const routerInstance = new Router(); // Router's constructor still calls init()
    console.log("main.js: Router instance created.");

    // 5. Connect the Router to the Sidebar for active link updates
    // This MUST happen BEFORE the initial route change is triggered by the Router.
    console.log("main.js: Subscribing Sidebar to Router changes...");
    routerInstance.onRouteChange((path) => {
        console.log("main.js: Router callback triggered. Calling sidebarInstance.updateActiveLinks with path:", path);
        sidebarInstance.updateActiveLinks(path);
    });
    console.log("main.js: Sidebar subscribed to Router changes.");

    // 6. NOW, manually trigger the initial route change after all listeners are set up.
    // We need to modify the Router to have a public method for this.
    console.log("main.js: Manually triggering initial route change via router.");
    routerInstance.triggerInitialRoute(); // <-- NEW: Call a new public method
});