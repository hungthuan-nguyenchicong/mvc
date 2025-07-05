import './sidebar.scss';
class Sidebar {
    constructor() {
        // Initialize the sidebarElement in the constructor
        this.sidebarElement = document.createElement('aside');
        // Add a class for potential styling
        this.sidebarElement.classList.add('sidebar');
    }

    setupSidebar() {
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.error('no main');
            return;
        }
        //const sidebarElement = document.createElement('aside');
        mainElement.appendChild(this.sidebarElement);
    }

    render() {
        return /* html */ `
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
        this.setupSidebar();
        this.sidebarElement.innerHTML = this.render()
    }
}

export const sidebarInstance = new Sidebar();