## 1.1

// main.js

import './main.scss';
import './hoc-vi-du-co-ban/nav.scss';
import './hoc-vi-du-co-ban/main.scss';

// Get the root app element
const app = document.getElementById('app');

// Create nav element
const navElement = document.createElement('nav');
app.appendChild(navElement);

// Populate nav
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" data-path="/">Home</a></li>
        <li><a href="/about" data-path="/about">About</a></li>
        <li><a href="/contact" data-path="/contact">Contact</a></li>
        <li><a href="/test" data-path="/test">Test 404</a></li>
    </ul>
`;

// Define routes
const routes = {
    '/': {
        title: 'Trang chu',
        content: /* html */ `
            <h1>Trang chu</h1>
        `
    },
    '/about': {
        title: 'Ve chung toi',
        content: /* html */ `
            <h1>Aboute</h1>
        `
    },
    '/contact': {
        title: 'Lien hee',
        content: /* html */ `
            <h1>Contact</h1>
        `
    },
    '/404': {
        title: '404',
        content: /* html */ `
            <h1>404 not found</h1>
        `
    }
};

// Create main content element
const mainContent = document.createElement('main');
app.appendChild(mainContent);

// --- Core Functions ---

/**
 * Renders content based on the given path.
 * Falls back to 404 if route not found.
 * @param {string} path - The URL path to render.
 */
const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    document.title = page.title;
    mainContent.innerHTML = page.content;
};

/**
 * Sets the 'active' class on the navigation link corresponding to the current path.
 * Removes 'active' from all other links.
 * @param {string} currentPath - The path to mark as active.
 */
const setActiveLink = (currentPath) => {
    document.querySelectorAll('a[data-path]').forEach(link => {
        link.classList.remove('active'); // Remove 'active' from all links
        if (link.getAttribute('data-path') === currentPath) {
            link.classList.add('active'); // Add 'active' to the matching link
        }
    });
};

// --- Event Handlers and Initial Setup ---

/**
 * Sets up click listeners for navigation links.
 */
const setupNavigationClicks = () => {
    const linkItems = app.querySelectorAll('a[data-path]');
    linkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default browser navigation

            const path = e.target.getAttribute('data-path');
            window.history.pushState({}, '', path); // Add new state to history

            renderContent(path); // Render the new content
            setActiveLink(path); // Set the active class for the clicked link
        });
    });
};

// 1. Initial Page Load
document.addEventListener('DOMContentLoaded', () => {
    let initialPath = window.location.pathname;

    // Handle 404 on initial load before rendering
    if (!routes[initialPath]) {
        window.history.replaceState({}, '', '/404'); // Replace URL to /404
        initialPath = '/404'; // Use /404 for content and active link
    }

    renderContent(initialPath); // Render content for the initial path
    setActiveLink(initialPath); // Set the active link for the initial path
});


// 2. Browser Back/Forward Button Handling (popstate event)
window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    renderContent(path); // Render content for the new history state
    setActiveLink(path); // Update the active link based on the new path
});

// 3. Setup Click Listeners
setupNavigationClicks(); // Call this to attach event listeners to links

## tham khảo v2

import './main.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/nav.scss';

// Get app
const app = document.getElementById('app');

// Create and append nav
const navElement = document.createElement('nav');
app.appendChild(navElement);
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" data-path="/">Home</a></li>
        <li><a href="/about" data-path="/about">About</a></li>
        <li><a href="/contact" data-path="/contact">Contact</a></li>
        <li><a href="/test" data-path="/test">Test 404</a></li>
    </ul>
`;

// Create and append main content area
const mainContent = document.createElement('main');
app.appendChild(mainContent);

// Routes configuration
const routes = {
    '/': {
        content: '<h1>Home</h1>',
        title: 'Home Page' // Added titles for better SEO/UX with document.title
    },
    '/about': {
        content: '<h1>About</h1>',
        title: 'About Us'
    },
    '/contact': {
        content: '<h1>Contact</h1>',
        title: 'Contact Us'
    },
    '/404': {
        content: '<h1>Page Not Found</h1>',
        title: '404 - Not Found'
    }
};

/**
 * Renders content and updates document title based on the given path.
 * Falls back to 404 if route not found.
 * @param {string} path - The URL path to render.
 */
const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    mainContent.innerHTML = page.content;
    document.title = page.title || 'My SPA'; // Set document title
};

/**
 * Sets the 'active' class on the navigation link corresponding to the current path.
 * Removes 'active' from all other links.
 * @param {string} currentPath - The path to mark as active.
 */
const setActiveLink = (currentPath) => {
    document.querySelectorAll('a[data-path]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-path') === currentPath) {
            link.classList.add('active');
        }
    });
};

/**
 * The central routing function that handles UI updates based on the current URL.
 * It also corrects the URL to /404 if the path is not found.
 */
const router = () => {
    let currentPath = window.location.pathname;

    // Handle 404 route: if the current path isn't in our routes, redirect to /404
    if (!routes[currentPath]) {
        window.history.replaceState({}, '', '/404');
        currentPath = '/404'; // Use /404 path for rendering and active link
    }

    renderContent(currentPath); // Render the main content
    setActiveLink(currentPath); // Update the active state of navigation links
};

// --- Event Listeners and Initial Setup ---

// 1. Handle direct navigation link clicks
document.addEventListener('click', (e) => {
    // Use .closest() to ensure we get the <a> tag even if a child element was clicked
    const targetLink = e.target.closest('a[data-path]');
    if (targetLink) {
        e.preventDefault(); // Prevent default full page reload
        const path = targetLink.getAttribute('data-path');

        // Only push a new state if the path is different from the current one
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }
        // Call the router to update the UI
        router();
    }
});

// 2. Handle browser back/forward buttons (popstate event)
window.addEventListener('popstate', () => {
    router(); // Just call the router, it will get the new path from window.location.pathname
});

// 3. Initial page load
// Ensures the content and active link are set up correctly when the page first loads
document.addEventListener('DOMContentLoaded', () => {
    router(); // Call the router to handle the initial URL
});