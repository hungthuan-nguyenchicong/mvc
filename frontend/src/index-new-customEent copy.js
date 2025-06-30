import './main.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/nav.scss';

// app
const app = document.getElementById('app');
// add nav
const navElement = document.createElement('nav');
app.appendChild(navElement);
// render nav
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" route>Home</a></li>
        <li><a href="/about" route>About</a></li>
        <li><a href="/contact" route>Contact</a></li>
        <li><a href="/test" route>Test 404</a></li>
        <li><a href="/noroute">No Route</a></li>
    </ul>
`;

// main content
const mainContent = document.createElement('main');
app.appendChild(mainContent);

// routes

const routes = {
    '/': {
        content: '<h1>Home</h1>'
    },
    '/about': {
        content: '<h1>About</h1>'
    },
    '/contact': {
        content: '<h1>Contact</h1>'
    },
    '/404': {
        content: '<h1>Page 404</h1>'
    }
}

// rendercontent

const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    mainContent.innerHTML = page.content;
}

// router
const router = ()=>{
    let currentPath = window.location.pathname;
    //console.log(currentPath)
    // chuuyen hong neu url <> routes
    if (!routes[currentPath]) {
        window.history.replaceState(null,null,'/404');
        renderContent('/404');
    }
    // render content
    renderContent(currentPath);
    // phat ra su kien routeChange
    // tao su kien tuy chinh routeChangeEvent
    const routeChangeEvent = new CustomEvent(
        'routeChange', {
            detail: {path: currentPath}
        }
    );
    // phat su kien tren document de cac thanh phan khac co the lang nghe
    document.dispatchEvent(routeChangeEvent);
}

// su ly click link route

document.addEventListener('click',(e)=>{
    const routeLink = e.target.closest(('a[route]'));
    if (routeLink) {
        e.preventDefault();
        const path = e.target.getAttribute('href');

        // chi push neu path khac de tranh trung lap lich su
        if (window.location.pathname !== path) {
            window.history.pushState(null,null,path);
        }
        // kich hoat router()
        router();
    }
});

// su ly quay lai tien len cua trinh duyet
window.addEventListener('popstate', ()=>{
    // kick hoat router
    router();
});

// lang nghe su kien routeChang -> add class active
const setupNavActiveLinkListener = ()=>{
    // lang nghe su kien tren document de bao quat toan bo ung dung
    document.addEventListener('routeChange', (e)=>{
        // lay path tu du lieu su kien
        const {path} = e.detail;
        // xu ly class active
        document.querySelectorAll('a[route]').forEach(link => {
            // remove all class 'active
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', ()=>{
    //renderContent('/')
    // mac dinh khi loaded
    router();
    setupNavActiveLinkListener();
});

