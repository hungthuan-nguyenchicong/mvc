// ./src/header.js
import './header.scss';
class Header {
    constructor() {
        this.header = document.createElement('header');
    }

    render () {
        return /* html*/ `
            <p>Chào mừng bạn đến với trang quản trị</p>
            <button id="btn-logout" type="submit">Đăng Xuất</button>
        `;
    }

    logout() {
        const btnLogout = document.getElementById('btn-logout');
        btnLogout.addEventListener('click', ()=> {
            window.location.href = '/admin/logout';
        })
    }

    init() {
        document.body.appendChild(this.header);
        this.header.innerHTML = this.render();
        this.logout();
    }
}

export const headerInstance = new Header();