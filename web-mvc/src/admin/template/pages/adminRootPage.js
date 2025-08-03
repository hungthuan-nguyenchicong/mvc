// web-mvc/src/admin/template/pages/adminRootPage.js

function adminRootPage() {
    const contentElement = document.querySelector('.content');
    if (contentElement) {
        return contentElement;
    } else {
        console.error(`no: div.content`);
    }
}

export {adminRootPage}

