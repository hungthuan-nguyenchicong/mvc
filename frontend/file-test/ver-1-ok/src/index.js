import App from './app';
//import './style.css'; // Ví dụ: import CSS

import './style.scss'; // Thay vì './style.css'


const appContainer = document.getElementById('app');

if (appContainer) {
    const app = new App(appContainer);
    app.init();
} else {
    console.error('Element with ID "app" not found.');
}