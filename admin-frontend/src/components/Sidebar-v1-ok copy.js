// src/compoments/Sidebar.js
import './sidebar.scss';
export class Sidebar {
    constructor() {
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
                        <a href="/posts" class="nav-link" data-link>Tất cả Bài viết</a>
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

    clickLink() {
        if (!this.sidebarElement) {
            console.warn('no sidebarElement');
            return;
        }

        if (!this.linkItems) {
            this.linkItems = this.sidebarElement.querySelectorAll('a[data-link]');
        }

        
        this.linkItems.forEach(link => {
            link.addEventListener('click', (e)=> {
                e.preventDefault();
                // 1. remove all 'active
                this.linkItems.forEach(linkItem => {
                    linkItem.classList.remove('active');
                })
                e.currentTarget.classList.add('active');
            });
        });
    }
}