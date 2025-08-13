//web-mvc/src/admin/main.js
import './main.scss'
import { adminHeader } from "./template/parts/header";
import { adminSidebar } from './template/parts/sidebar';
import { adminMainContent } from './template/parts/mainContent';
import { rightSidebar } from './template/parts/rightSidebar';
// flat message
import { adminFlatMessage } from './template/parts/flatMessage';
// admin router frontend
import { adminRouterFrontend } from './core/adminRouterFrontend';
// sidebar actiivelink -> router -> CustomEvent navigated
import { activeLinkSidebar } from './template/utils/activeLinkSidebar';
// click a link -> linkHandler
import { linkHandler } from './core/linkHandler';

// upload file
import { uploadFile } from './core/uploads/uploadFile';
document.addEventListener('DOMContentLoaded', ()=>{
    // flat message
    //adminFlatMessage();
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
    // add div messageContainer -> body
    //document.body.appendChild(adminFlatMessage);

    // right sidebar
    const rightSidebarElement = document.createElement('div');
    rightSidebarElement.className = 'rightSidebar';
    //const rightSidebarContent = rightSidebar();
    rightSidebarElement.innerHTML = rightSidebar();
    mainElement.appendChild(rightSidebarElement);
    // click a link -> linkHandeler
    linkHandler();
    // adminRouterFrontend
    adminRouterFrontend();
    // active link sidebar
    activeLinkSidebar();
    // flat message
    adminFlatMessage();
    // upload file
    uploadFile();
})