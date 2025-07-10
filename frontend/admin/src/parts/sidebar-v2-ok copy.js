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
                <li><a href="/admin/views" route>Home</a></li>
                <li><a href="/admin/views/about" route>About</a></li>
                <hr>
                <li><a href="/admin/views/posts/789" route>Detail Pots (789)</a></li>
                <hr>
                <li><a href="/admin/api/products" route>All Products</a></li>
                <li><a href="/product-create" route>Create Product</a></li>
                <li><a href="/products/789" route>Detail Product (789)</a></li>
                <li><a href="/category-products" route>Category Products</a></li>
            </ul>
        `;
    }

    setupActiveLink() {
        //console.log(this.eventEmitterInstance)
        // Listen for the 'routeChange' event
        this.eventEmitterInstance.on('routeChange', (currentPath)=>{
            const sidebarLink = this.sidebar.querySelectorAll('a[route]');
            sidebarLink.forEach(link => {
                const linkPath = link.getAttribute('href');
                if (currentPath === linkPath) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            })
        })
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