// ./src/app.js
import './app.scss';
import { headerInstance } from "./parts/header";
import { mainInstance } from "./parts/main";

// router
import { routes } from './routes';
import { routerInstance } from './core/router'; // Import the exported instance

document.addEventListener('DOMContentLoaded', () => {
    headerInstance.init();
    mainInstance.init();

    // router
    // Pass the routes to the *existing* routerInstance
    routerInstance.routes = routes; // Assign routes to the imported routerInstance
    routerInstance.init();
});