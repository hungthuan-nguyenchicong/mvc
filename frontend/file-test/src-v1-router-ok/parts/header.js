// ./src/parts/header.js
import './header.scss';
class Header {
    constructor() {
        this.headerElement = document.createElement('header');
    }

    setupHeader() {
        document.body.appendChild(this.headerElement);
    }

    render() {
        this.headerElement.innerHTML = /* html */ `
            <p>Chào mừng bạn đến với trang quản trị<p>
        `;
    }

    init() {
        this.setupHeader();
        this.render();
    }
}

export const headerInstance = new Header();