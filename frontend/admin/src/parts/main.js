// ./src/parts/main.js
import './main.scss';
import { sidebarInstance } from './sidebar';
import { contentInstance } from './content';
class Main {
    constructor() {
        this.main = document.createElement('main');
    }

    init() {
        document.body.appendChild(this.main);
        // add sidebar
        sidebarInstance.init();
        // add content
        contentInstance.init();
    }
}

export const mainInstance = new Main();