// ./index.js

import './main.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/nav.scss';
import './hoc-vi-du-co-ban/sidebar.scss';
import './hoc-vi-du-co-ban/main-content.scss';

import {
    //renderContent
    //router,
    init,
} from './router.js';

// app
const app = document.getElementById('app');
// add nav
const navElement = document.createElement('nav');
app.appendChild(navElement);
// nav render
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/about" route>About</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <li><a href="/test" route>Tes 404</a></li>
    </ul>
`;

// main element
const mainElement = document.createElement('main');
app.appendChild(mainElement);

// sidebar element
const sidebarElement = document.createElement('aside');
mainElement.appendChild(sidebarElement);

// sidebar render
sidebarElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <hr>
        <li><a href="/products" route>All Products</a></li>
        <li><a href="/product-create" route>Create Product</a></li>
        <li><a href="/category-products" route>Category Products</a></li>
    </ul>
`;

// main-content
const mainContent = document.createElement('div');
mainContent.classList.add('main-content');
mainElement.appendChild(mainContent);

// load
document.addEventListener('DOMContentLoaded',()=>{
    //renderContent('/about')
    init();
})




















