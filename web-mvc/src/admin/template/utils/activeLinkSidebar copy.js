// web-mvc/src/admin/template/utils/activeLinkSidebar.js

function activeLinkSidebar() {
    function updateActiveLink(currentUrl) {
        //const currentUrl = window.location.pathname + window.location.search;
        // Remove the 'active' class from any currently active link
        const currentActive = document.querySelector('a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // Find the link that matches the current URL and add the 'active' class
        const links = document.querySelectorAll('aside a');
        links.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentUrl.includes(linkHref) && linkHref !== '/admin/') {
                link.classList.add('active');
            } else if (currentUrl === linkHref) {
                link.classList.add('active');
            }
        })
    }
    // // Also run on initial page load to set the correct active link
    // updateActiveLink();
    // // Listen for the custom 'navigated' event
    // document.addEventListener('navigated', updateActiveLink)
    // Listen for the custom 'navigated' event
    document.addEventListener('navigated', (e)=> {
        const newUrl = e.detail.href;
        updateActiveLink(newUrl);
    })
    // Also run on initial page load to set the correct active link
    updateActiveLink(window.location.pathname + window.location.search);
}

export {activeLinkSidebar}