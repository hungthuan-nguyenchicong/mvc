// main.js

import './main.scss';
import './hoc-vi-du-co-ban/nav.scss';
import './hoc-vi-du-co-ban/main.scss';

// lấy phần tử gốc app

const app = document.getElementById('app');

// tao phan tu nav
const navElement = document.createElement('nav');
app.appendChild(navElement);

// tao nav

navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" data-path="/">Home</a></li>
        <li><a href="/about" data-path="/about">About</a></li>
        <li><a href="/contact" data-path="/contact">Contact</a></li>
        <li><a href="/test" data-path="/test">Test 404</a></li>
    </ul>
`;

// tao routes

const routes = {
    '/': {
        title: 'Trang chu',
        content: /* html */ `
            <h1>Trang chu</h1>
        `
    },
    '/about': {
        title: 'Ve chung toi',
        content: /* html */ `
            <h1>Aboute</h1>
        `
    },
    '/contact': {
        title: 'Lien hee',
        content: /* html */ `
            <h1>Contact</h1>
        `
    },
    '/404': {
        title: '404',
        content: /* html */ `
            <h1>404 not found</h1>
        `
    }
}

// tao phan tu main de chua noi dung trang

const mainContent = document.createElement('main');
app.appendChild(mainContent);

// event cicks
// app.addEventListener('click', (e)=>{
//     const targetLink = e.target.closest('a[data-path]');
//     document.querySelectorAll()
//     if (targetLink) {
//         e.preventDefault();
//         const path = targetLink.getAttribute('data-path');
//         //console.log(path)
//         //window.addEventListener('popstate', path);
//         window.history.pushState({},'',path);
//         renderContent(path);
//     }
// });



// renderContent
const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    document.title = page.title;
    mainContent.innerHTML = page.content;

    // add class active
    // document.querySelectorAll('a[data-path]').forEach(link => {
    //     link.classList.remove('active');
    //     if (link.getAttribute('data-path') === path) {
    //         link.classList.add('active');
    //     }
    // });
};

// navigate
const navigate = () => {
    const linkItems = app.querySelectorAll('a[data-path]');
    linkItems.forEach(link => {
        link.addEventListener('click', (e)=>{
            e.preventDefault();
            const path = e.target.getAttribute('data-path');
            window.history.pushState({}, '', path);
            linkItems.forEach(linkItem => {
                linkItem.classList.remove('active');
            })
            e.target.classList.add('active');
            renderContent(path)
        });
    })

    // --- Initial Page Load Handling ---
    // This block handles the very first load of the page.
    const currentInitialPath = window.location.pathname;
    // render content 
    renderContent(currentInitialPath);
    // add class active currentInitialPath
    linkItems.forEach(link => {
        if (link.getAttribute('data-path') === currentInitialPath) {
            link.classList.add('active');
        }
    });
    // route not found
    if (!routes[currentInitialPath]) {
        window.history.replaceState({},'','/404');
        renderContent('/404');
    }
}
navigate();

window.addEventListener('popstate', ()=>{
    const path = window.location.pathname;
    // window.history.pushState({}, '', path); // Still commented out
    renderContent(path); // This is where new content is rendered and likely, the new active link is set
    document.querySelectorAll('a[data-path]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-path') === path) {
            link.classList.add('active');
        }
    });
    
});

//renderContent(window.location.pathname);

// if (!routes[window.location.pathname]) {
//     // Thay đổi URL thành /404 mà không thêm vào lịch sử trình duyệt
//     window.history.replaceState({},'','/404');
//     renderContent('/404');
// }