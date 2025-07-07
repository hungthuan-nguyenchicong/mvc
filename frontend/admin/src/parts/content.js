// ./src/parts/content.js
import './content.scss';
class Content {
    constructor() {
        this.content = document.createElement('div');
        this.content.classList.add('content');
    }

    init() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('no <main>');
            return;
        }
        mainElement.appendChild(this.content);
    }
}

export const contentInstance = new Content();