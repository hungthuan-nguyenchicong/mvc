// web-mvc/src/admin/core/activeLinkHandler.js

function activeLinkHandler() {
    const updateActiveLink = (currentUrl) => {
        // Remove the 'active' class from any currently active link
        const currentActive = document.querySelector('a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // Find the link that matches the current URL and add the 'active' class

        const links = document.querySelectorAll('aside a');
        links.forEach(link => {
            // Check if the link's href matches the current URL or the base URL
            const linkHref = link.getAttribute('href');
            if (currentUrl.includes(linkHref) && linkHref !== '/admin/') {
                // For paths with query strings
                link.classList.add('active');
            } else if (currentUrl === linkHref) {
                // For exact matches (like '/admin/')
                link.classList.add('active')
            }
        })
    }
    // Listen for the custom 'navigated' event
    document.addEventListener('navigated', (e)=> {
        const newUrl = e.detail.href;
        updateActiveLink(newUrl);
    })
    // Also run on initial page load to set the correct active link
    updateActiveLink(window.location.href);
}