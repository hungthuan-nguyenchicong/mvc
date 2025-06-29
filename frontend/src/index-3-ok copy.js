import './main.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/nav.scss';

// get app
const app = document.getElementById('app');
// create nav
const navElement = document.createElement('nav');
app.appendChild(navElement);
// nav innerHTML
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" data-path="/">Home</a></li>
        <li><a href="/about" data-path="/about">About</a></li>
        <li><a href="/contact" data-path="/contact">Contact</a></li>
        <li><a href="/test" data-path="/test">Test 404</a></li>
    </ul>
`;

// mainContent
const mainContent = document.createElement('main');
app.appendChild(mainContent);

// routes
const routes = {
    '/': {
        content: '<h1>Home</h1>'
    },
    '/about': {
        content: '<h1>About</h1>'
    },
    '/contact': {
        content: '<h1>Contact</h1>'
    },
    '/404': {
        content: '<h1>Page 404</h1>'
    }
}
// rende content
const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    mainContent.innerHTML = page.content;
}

// setup active link
const setActiveLink = (currentPath) => {
    document.querySelectorAll('a[data-path]').forEach(link =>{
        link.classList.remove('active');
        if (link.getAttribute('data-path') === currentPath) {
            link.classList.add('active');
        }
    });
};

// set up navigation click
const setupNavigationClicks = () => {
    const linkItems = app.querySelectorAll('a[data-path]');
    linkItems.forEach(link => {
        link.addEventListener('click', (e)=>{
            e.preventDefault();
            const path = e.target.getAttribute('data-path');
            renderContent(path);
            window.history.pushState({},'',path);
            setActiveLink(path);
        });
    });
};
// setup Initial Page
const setupInitialPage = () => {
    let initialPath = window.location.pathname;
    if (!routes[initialPath]) {
        window.history.replaceState({},'','/404');
        initialPath = '/404';
    }
    renderContent(initialPath);
    setActiveLink(initialPath);
}

// popstate
window.addEventListener('popstate', ()=>{
    const path = window.location.pathname;
    renderContent(path);
    setActiveLink(path);
});

document.addEventListener('DOMContentLoaded', ()=>{
    // initialPath
    setupInitialPage();

    // click link
    setupNavigationClicks();
});