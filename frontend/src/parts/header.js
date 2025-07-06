// ./src/header.js
import './header.scss';
class Header {
    constructor() {
        this.header = document.createElement('header');
    }

    render () {
        return /* html*/ `
            <p>Chào mừng bạn đến với trang quản trị<p>
        `;
    }

    init() {
        document.body.appendChild(this.header);
        this.header.innerHTML = this.render();
    }
}

export const headerInstance = new Header();