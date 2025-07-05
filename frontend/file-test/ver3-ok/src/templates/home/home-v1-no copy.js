// src/templates/home/home.js
export class Home {
    constructor() {
        this.homeElement = null;
    }

    setupHome() {
        const mainContent = document.querySelector('div.main-content');
        if (!mainContent) {
            console.error('no div.main-content');
            return;
        }
        return this.homeElement = mainContent;
    }

    render() {
        return /* html */ `
            <h1>Trang Home</h1>
        `;
    }

    init() {
        this.setupHome();
        this.homeElement.innerHTML = this.render();
    }
}
