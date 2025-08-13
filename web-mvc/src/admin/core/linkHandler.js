// web-mvc/src/admin/core/linkHandler.js

function linkHandler() {
    // click a link
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            //console.log(href);
            history.pushState(null, null, href);
            const navEvent = new CustomEvent('navigated', {detail:{href:href}});
            document.dispatchEvent(navEvent);
        }
    });
    // kich hoat popstate
    window.addEventListener('popstate', ()=>{
        const href = window.location.pathname + window.location.search;
        //console.log(href)
        const navEvent = new CustomEvent('navigated', {detail:{href:href}});
        document.dispatchEvent(navEvent);
    });
}

export {linkHandler};