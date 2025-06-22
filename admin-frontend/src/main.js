import './style.scss'
import {Header} from './components/Header.js';
import {Sidebar} from './components/Sidebar.js';


document.addEventListener('DOMContentLoaded', ()=>{
  const app = document.getElementById('app');

  // header
  const headerInstance = new Header(); // Khởi tạo instance
  const header = headerInstance.render(); // Gọi render()
  app.appendChild(header);
  // sidebar
  const sidebarInstance = new Sidebar();
  const sidebar = sidebarInstance.render();
  app.appendChild(sidebar);
  // 3. Gắn các sự kiện SAU KHI sidebar đã có trong DOM
  sidebarInstance.addEventListeners();
});
