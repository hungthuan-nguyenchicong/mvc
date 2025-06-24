// src/compoments/Header.js
import './header.scss';
export class Header {
    constructor() {
        this.headerElement = null;
    }

    render() {
        this.headerElement = document.createElement('header');
        this.headerElement.innerHTML = /* html */ `
            <h1>Chào mừng bạn đến với trang quản trị</h1>
        `;
        return this.headerElement;
    }
}