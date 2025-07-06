// ./src/parts/sidebar.js
import './sidebar.scss';
class Sidebar {
    constructor() {
        this.sidebar = document.createElement('aside');
        this.sidebar.classList.add('sidebar');
    }

    render() {
        return /* html */ `
            <ul>
                <li><a href="/" route>Home</a></li>
                <li><a href="/about" route>About</a></li>
                <hr>
                <li><a href="/posts/789" route>Detail Pots (789)</a></li>
                <hr>
                <li><a href="/products" route>All Products</a></li>
                <li><a href="/product-create" route>Create Product</a></li>
                <li><a href="/products/789" route>Detail Product (789)</a></li>
                <li><a href="/category-products" route>Category Products</a></li>
            </ul>
        `;
    }

    init() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('no <main>');
            return;
        }
        this.sidebar.innerHTML = this.render();
        mainElement.appendChild(this.sidebar);
    }
}

export const sidebarInstance = new Sidebar();