// ./src/parts/main-content.js
import './main-content.scss';
class MainContent {
    constructor() {
        this.mainContentElement = document.createElement('div');
        this.mainContentElement.classList.add('main-content');
    }

    setupMainContent() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('no <main>');
            return;
        }
        mainElement.appendChild(this.mainContentElement);
    }

    init() {
        this.setupMainContent();
    }
}

export const mainContentInstance = new MainContent();