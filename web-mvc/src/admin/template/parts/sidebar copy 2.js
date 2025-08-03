// web-mvc/src/admin/template/parts/sidebar.js
import './sidebar.scss'
function adminSidebar() {
    return /* html */ `
    <aside>
        <ul>
            <li><a href="/admin/">DashBoard</a></li>
            <li><a href="/admin/abc">Test url: /admin/abc</a></li>

            <hr>
            <li><a href="/admin/?p=posts&action=index">Post Index</a></li>
            <li><a href="/admin/?p=posts&action=create">Post Create</a></li>
            <li><a href="/admin/?p=posts&action=show&id=1">Post Show id = 1</a></li>

        </ul>
    </aside>
    `;
}
function activeLink() {
    function updateActiveLink(currentUrl) {
        // Remove the 'active' class from any currently active link
        const currentActive = document.querySelector('a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        //console.log(currentUrl)
        // Find the link that matches the current URL and add the 'active' class
        const links = document.querySelectorAll('aside a');
        links.forEach(link => {
            // Check if the link's href matches the current URL or the base URL
            const linkHref = link.getAttribute('href');
            if (currentUrl.includes(linkHref) && linkHref !== '/admin/') {
                link.classList.add('active');
            } else if (currentUrl === linkHref) {
                link.classList.add('active');
            }
        });
    }
    // Listen for the custom 'navigated' event
    document.addEventListener('navigated', (e) => {
        const newUrl = e.detail.href;
        updateActiveLink(newUrl);
    });
    // Also run on initial page load to set the correct active link
    //updateActiveLink(window.location.pathname + window.location.search);
}
activeLink();
//console.log(window.location.href)
export {adminSidebar}