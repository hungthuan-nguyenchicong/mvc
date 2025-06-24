// src/core/Router.js
function tt(t) {
    console.log(t);
}
function renderContent(path) {
    const contentDiv = document.getElementById('content'); // Assume you have a div with id="app" to render content into
    if (!contentDiv) {
        console.error("No element with id 'app' found to render content.");
        return;
    }

    switch (path) {
        case '/':
            contentDiv.innerHTML = '<h1>Welcome to the Home Page!</h1><p>This is the main page content.</p>';
            break;
        case '/posts':
            contentDiv.innerHTML = '<h1>About Us</h1><p>Learn more about our company.</p>';
            break;
        case '/contact':
            contentDiv.innerHTML = '<h1>Contact Us</h1><p>Get in touch with us.</p>';
            break;
        default:
            contentDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>';
            break;
    }
}

export class Router {
    constructor() {
        this.init();
    }

    init() {
        // Listen for browser back/forward button events
        window.addEventListener('popstate', () => {
            renderContent(window.location.pathname);
        });

        // Listen for clicks on data-link attributes
        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[data-link]'); // Use e.target for more precise targeting
            if (routeLink) {
                e.preventDefault(); // Prevent default link behavior
                const path = routeLink.getAttribute('href');
                tt(path)
                // Update URL and render content
                history.pushState(null, '', path);
                renderContent(path);
            }
        });

        // Initial content load based on current URL
        renderContent(window.location.pathname);
    }
}