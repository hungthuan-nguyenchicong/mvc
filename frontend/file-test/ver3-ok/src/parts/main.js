import './main.scss';
class Main {
    constructor() {
        this.mainElement = document.createElement('main');
        //this.mainContent.classList.add('main-content');
    }

    setupMain() {
        const app = document.getElementById('app');
        if (!app) {
            console.error('no id app');
            return;
        }
        app.appendChild(this.mainElement);
    }

    init() {
        this.setupMain();
    }
}

export const mainInstance = new Main();