// ./src/parts/sidebar.js
import './sidebar.scss';
import { eventEmitterInstance } from '../utils/event-emitter';
class Sidebar {
    constructor() {
        this.sidebar = document.createElement('aside');
        this.sidebar.classList.add('sidebar');
        this.eventEmitterInstance = eventEmitterInstance;
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

    setupActiveLink() {
        console.log(this.eventEmitterInstance)
        // Listen for the 'routeChange' event
        this.eventEmitterInstance.on('routeChange', (currentPath) => {
            const sidebarLinks = this.sidebar.querySelectorAll('a[route]');

            sidebarLinks.forEach(link => {
                // Get the href attribute of the link
                const linkPath = link.getAttribute('href');

                // Check if the currentPath matches the link's path
                // For dynamic routes like /posts/{id}, you'll need more sophisticated matching
                // For now, a direct match or startsWith for parent paths is sufficient.
                if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }

    init() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('no <main>');
            return;
        }
        this.sidebar.innerHTML = this.render();
        mainElement.appendChild(this.sidebar);
        // active link
        this.setupActiveLink();
    }
}

export const sidebarInstance = new Sidebar();