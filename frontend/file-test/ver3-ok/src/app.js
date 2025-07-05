// src/app.js
// Import các module cần thiết
// import './main.scss'; // Nếu bạn có file SCSS chính
// import { Header } from './components/Header.js'; // Nếu bạn có Header component
// import { Sidebar } from './components/Sidebar.js'; // Nếu bạn có Sidebar component
import { Router } from './core/Router.js';
import { routes } from './routes.js'; // **Đã bỏ comment và import đúng cách**

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) {
        console.warn('Cảnh báo: Không tìm thấy phần tử có id="app" trong HTML.');
        return;
    }

    // Khởi tạo Header (Nếu có)
    // const headerInstance = new Header();
    // const headerElement = headerInstance.render();
    // app.appendChild(headerElement);

    // Tạo phần tử chính cho nội dung (main area)
    const mainElement = document.createElement('div');
    mainElement.classList.add('main'); // Thêm class 'main' cho CSS
    app.appendChild(mainElement);

    // Khởi tạo Sidebar (Nếu có)
    // const sidebarInstance = new Sidebar();
    // const sidebarElement = sidebarInstance.render();
    // mainElement.appendChild(sidebarElement); // Đảm bảo thêm vào mainElement
    // sidebarInstance.init(); // Khởi tạo các sự kiện cho Sidebar

    // Tạo phần tử để hiển thị nội dung của từng tuyến đường
    const contentElement = document.createElement('div');
    contentElement.id = 'content'; // ID này được Router sử dụng để render
    mainElement.appendChild(contentElement);

    // Khởi tạo Router và truyền mảng routes vào
    const routerInstance = new Router(routes);
    routerInstance.init(); // Khởi tạo lắng nghe sự kiện và định tuyến ban đầu

    // Gán đường dẫn hiện tại cho Sidebar nếu cần (Khi Sidebar được khởi tạo)
    // if (sidebarInstance) {
    //     sidebarInstance.clickLink(routerInstance.currentPath);
    // }
});