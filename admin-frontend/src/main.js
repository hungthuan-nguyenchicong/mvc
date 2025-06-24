// src/main.js
import './main.scss';
import {Header} from './components/Header.js'
import { Sidebar } from "./components/Sidebar.js";
import { Router } from './core/Router.js';

document.addEventListener('DOMContentLoaded', ()=>{
    const app = document.getElementById('app');
    if (!app) {
        console.warn('no id=app');
        return;
    }

    // header
    const headerInstance = new Header();
    const headerElement = headerInstance.render();
    app.appendChild(headerElement);

    // sidebar
    const sidebarInstance = new Sidebar();
    const sidebarElement = sidebarInstance.render();
    app.appendChild(sidebarElement);
    //sidebarInstance.clickLink();

    // content
    const contentElement = document.createElement('div');
    contentElement.id = 'content';
    app.appendChild(contentElement);

    // router
    const routerInstance = new Router();
    routerInstance.init();
    // side add current path
    sidebarInstance.clickLink(routerInstance.currentPath);
});