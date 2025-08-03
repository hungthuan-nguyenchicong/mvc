//web-mvc/src/admin/main.js
import './main.scss'
import { adminHeader } from "./template/parts/header";
import { adminSidebar } from './template/parts/sidebar';
import { adminMainContent } from './template/parts/mainContent';

// admin router frontend
import { adminRouterFrontend } from './core/adminRouterFrontend';
// sidebar actiivelink -> router -> CustomEvent navigated
import { activeLinkSidebar } from './template/utils/activeLinkSidebar';
document.addEventListener('DOMContentLoaded', ()=>{
    // add header
    const headerElement = document.createElement('header');
    headerElement.innerHTML = adminHeader();
    document.body.appendChild(headerElement)
    // add main
    const mainElement = document.createElement('main');
    document.body.appendChild(mainElement);
    // add sidebar -> main
    const sidebarElement = document.createElement('div');
    sidebarElement.className = 'sidebar';
    const sidebar = adminSidebar();
    sidebarElement.innerHTML = sidebar;
    mainElement.appendChild(sidebarElement)
    // add main-content -> main
    const mainContentElement = document.createElement('div');
    mainContentElement.className = 'mainContent';
    const mainContent = adminMainContent();
    mainContentElement.innerHTML = mainContent;
    mainElement.appendChild(mainContentElement);

    // adminRouterFrontend
    adminRouterFrontend();
    // active link sidebar
    activeLinkSidebar();
})