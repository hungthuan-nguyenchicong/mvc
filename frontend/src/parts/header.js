import './header.scss';
class Header {
    constructor() {
        this.headerElement = document.createElement('header');
    }

    setupHeader () {
        const app = document.getElementById('app');
        if (!app) {
            console.error('no id app');
            return;
        }
        app.appendChild(this.headerElement);
    }
    
    render() {
        return /* html */ `
        <p>Chào nừng bạn đến với trang quản trị</p>
        `;
    }

    init() {
        this.setupHeader();
        this.headerElement.innerHTML = this.render();
    }
}

export const headerInstance = new Header();