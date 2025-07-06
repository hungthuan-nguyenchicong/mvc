// ./src/parts/main.js
import './main.scss';
import { mainSidebarInstance } from './main-sidebar';
import { mainContentInstance } from './main-content';
class Main {
    constructor() {
        this.mainElement = document.createElement('main');
    }

    setupMain() {
        document.body.appendChild(this.mainElement);
    }

    init() {
        this.setupMain();
        mainSidebarInstance.init();
        mainContentInstance.init();
    }

}

export const mainInstance = new Main();