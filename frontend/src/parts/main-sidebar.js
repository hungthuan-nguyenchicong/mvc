// ./src/parts/sidebar.js
import './main-sidebar.scss';
class MainSidebar {
    constructor() {
        this.mainSidebarElement = document.createElement('aside');
        this.mainSidebarElement.classList.add('main-sidebar');
    }

    setupMainSidebar() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('no <main>');
            return;
        }
        mainElement.appendChild(this.mainSidebarElement);
    }

    render () {
        this.mainSidebarElement.innerHTML = /* html */ `
            <ul>
                <li><a href="/" route>Home</a></li>
                <li><a href="/contact" route>Contact</a></li>
                <hr>
                <li><a href="/products" route>All Products</a></li>
                <li><a href="/product-create" route>Create Product</a></li>
                <li><a href="/products/789" route>Specific Product (789)</a></li>
                <li><a href="/category-products" route>Category Products</a></li>
            </ul>
        `;
    }

    init() {
        this.setupMainSidebar();
        this.render();
    }
}

export const mainSidebarInstance = new MainSidebar();