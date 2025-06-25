// src/main.js
import './main.scss';
//import { appEvents } from './utils/EventEmitter.js';
import {Header} from './components/Header.js'
import { Sidebar } from "./components/Sidebar.js";
import {routes} from './routes.js';
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

    // main
    const mainElement = document.createElement('div');
    mainElement.classList.add('main');
    app.appendChild(mainElement);

    // sidebar
    const sidebarInstance = new Sidebar();
    const sidebarElement = sidebarInstance.render();
    mainElement.appendChild(sidebarElement);
    sidebarInstance.init();
    //sidebarInstance.clickLink();

    // content
    const contentElement = document.createElement('div');
    contentElement.id = 'content';
    mainElement.appendChild(contentElement);

    // routes
    console.log(routes);

    // router
    const routerInstance = new Router();
    routerInstance.init();
    // side add current path
    //sidebarInstance.clickLink(routerInstance.currentPath);
});