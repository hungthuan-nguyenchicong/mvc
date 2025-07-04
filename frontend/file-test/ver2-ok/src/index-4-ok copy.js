import './main.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/nav.scss';

// get app
const app = document.getElementById('app');

// nav

const navElement = document.createElement('nav');
app.appendChild(navElement);

// render nav
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/about" route>About</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <li><a href="/test" route>Test 404</a></li>
    </ul>
`;

// create mainContent
const mainContent = document.createElement('main');
app.appendChild(mainContent);

// routes configuration
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

// render conten

const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    mainContent.innerHTML = page.content;
}

// set activeLink
const setActiveLink = (currentPath) => {
    document.querySelectorAll('a[route]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

const router = () => {
    let currentPath = window.location.pathname;
    
    // handle 404 route: if the current path isn't in our routes, ridirec tio /404
    if (!routes[currentPath]) {
        window.history.replaceState(null,null,'/404');
        currentPath = '/404';
    }
    // render content
    renderContent(currentPath);
    // add active link
    setActiveLink(currentPath);
}

// addEventLinstener and Initial Setup
// 1. handle direct navigation link clics

document.addEventListener('click', (e) => {
    // use .closest to ensure we get the a tag event if a chiild ellement was clicked
    const targetLink = e.target.closest('a[route]');
    if (targetLink) {
        e.preventDefault();
        const path = targetLink.getAttribute('href');
        if (window.location.pathname !== path) {
            window.history.pushState(null,null,path);
        }
        router();
    }
});

// popstate
window.addEventListener('popstate', ()=>{
    router();
});

// DOMContentLoaded -> router()
document.addEventListener('DOMContentLoaded', ()=>{
    router();
});