// src/main.js
import './main.scss';
import {Header} from './components/Header.js'
import { Sidebar } from "./components/Sidebar.js";

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
});