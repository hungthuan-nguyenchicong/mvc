// src/components/Sidebar.js
import './Sidebar.scss';

export class Sidebar {
    constructor() {
        this.sidebarElement = null;
        this.navLinks = null; // Store navLinks after rendering for efficiency
    }

    render() {
        this.sidebarElement = document.createElement('aside');
        this.sidebarElement.innerHTML = /* html */ `
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
        `;
        console.log("Sidebar.js: Sidebar render() completed.");
        return this.sidebarElement;
        // console.log("Sidebar: Updating active links for path:", currentPath); // <-- REMOVE THIS LINE
    }
    
    // This method will be called by the Router to update active links
    updateActiveLinks(currentPath) {
        console.log("Sidebar: Updating active links for path:", currentPath); // Keep this one! This is correct.
        // No need to use window.location.pathname here, as currentPath is the correct one passed by the Router
        
        if (!this.sidebarElement) {
            console.warn("Sidebar element not rendered yet. Cannot update active links.");
            return;
        }

        // Query navLinks only once after rendering or if not already set
        if (!this.navLinks) {
            this.navLinks = this.sidebarElement.querySelectorAll('a[data-link]');
        }

        // 1. Remove all 'active' and 'parent-active' classes from all links
        this.navLinks.forEach(navLink => {
            navLink.classList.remove('active');
            navLink.classList.remove('parent-active');
        });

        // 2. Find and add 'active'/'parent-active' based on the currentPath
        this.navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');

            // Exact match for 'active' class
            if (linkHref === currentPath) {
                link.classList.add('active');
                // If it's a sub-link, also activate its parent category link
                const parentUl = link.closest('ul ul');
                if (parentUl) {
                    const parentLink = parentUl.previousElementSibling; // The <a> immediately before the nested <ul>
                    if (parentLink && parentLink.matches('a[data-link]')) {
                        parentLink.classList.add('parent-active');
                    }
                }
            }
            // For parent links that match a prefix of the current path
            // e.g., /posts should be parent-active when /posts/create is currentPath
            // Avoid activating '/' as parent-active for all routes
            else if (currentPath.startsWith(linkHref + '/') && linkHref !== '/') {
                 link.classList.add('parent-active');
            }
        });

        // Special handling for the root '/' path
        // Ensure Dashboard is active only when exactly on '/'
        // This is necessary because currentPath.startsWith(linkHref + '/') would not apply to '/' itself.
        console.log('window.location.pathname root: ', window.location.pathname ); // This log confirms browser's current URL
        if (currentPath === '/') { // This condition will now correctly be true when Router passes '/'
            console.log('side bar root: ', currentPath ); // This log should now appear!
            const dashboardLink = this.sidebarElement.querySelector('a[href="/"]');
            if (dashboardLink) {
                dashboardLink.classList.add('active');
            }
        }
    }

    addEventListeners() {
        // ...
    }
}