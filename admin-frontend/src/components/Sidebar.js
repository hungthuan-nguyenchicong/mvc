// src/compoments/Sidebar.js
import './sidebar.scss';
import { appEvents } from '../utils/EventEmitter.js';
// function tt(t) {
//     console.log(t);
// }
export class Sidebar {
    constructor() {
        this.appEvents = appEvents;
        this.sidebarElement = null;
        this.linkItems = null;
    }
    render() {
        this.sidebarElement = document.createElement('aside');
        this.sidebarElement.innerHTML = /* html */ `
            <nav class="sidebar">
                <ul>
                    <li><a href="/" class="nav-link" data-link>Dashboard</a></li>
                    <hr>
                    <li>
                        <a href="/api/posts/post-index" class="nav-link" data-link>Tất cả Bài viết</a>
                        <ul>
                            <li><a href="/post/create" data-link>Thêm Mới</a></li>
                            <li><a href="/category/post" data-link>Danh mục bài viết</a></li>
                        </ul>
                    </li>
                    <hr>
                    <li>
                        <a href="/product" class="nav-link" data-link>Tất cả Sản Phẩm</a>
                        <ul>
                            <li><a href="/product/create" data-link>Thêm Mới</a></li>
                            <li><a href="/category/product" data-link>Danh mục Sản phẩm</a></li>
                        </ul>
                    </li>
                    <hr>
                    <li><a href="/settings" class="nav-link" data-link>Cài đặt</a></li>
                    <hr>
                    <li><a href="/logout" class="nav-link" data-link>Logout</a></li>
                </ul>
            </nav>
        `;
        return this.sidebarElement;
    }

    init() {
        //this.#renderDom();
        if (!this.sidebarElement) {
            console.warn('no sidebar #renderDom');
            return;
        }
        this.appEvents.on('pathChanged', (newPath) => {
            this._updateActiveClass(newPath);
        })
    }

    _updateActiveClass(path) {
        if (!this.linkItems) {
            this.linkItems = this.sidebarElement.querySelectorAll('a[data-link]');
        }

        this.linkItems.forEach(link => {
            // remove all class 
            link.classList.remove('active');
            link.classList.remove('parent-active');
            // link = router -> click a data-link
            const linkHref = link.getAttribute('href');
            if (linkHref === path) {
                link.classList.add('active');
                const parentUl = link.closest('ul ul');
                if (parentUl) {
                    const parentLink = parentUl.previousElementSibling;
                    if (parentLink && parentLink.matches('a[data-link]')) {
                        parentLink.classList.add('parent-active');
                    }
                }
            }
        });
    }
}