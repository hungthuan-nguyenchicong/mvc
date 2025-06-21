// js/router.js
import {tt} from './functions.js'
import { HomePage } from './views/home.js';
import { AboutPage } from './views/about.js';

export class Router {
    constructor(appElement) {
        
        if (!appElement) {
            console.error('Router requires an app elemnet to be provided');
            return;
        }
        this.appElement = appElement;

        // Gán this cho handleRouterBound để đảm bảo this luôn trỏ đúng trong element listener
        this.handleRouteBound = this.handleRoute.bind(this);
    }

    // phương thức đẻ bắt đầu lắng nghe sự kiện
    init() {
        // Lắng nghe sự kiện thay đổi has và gọi phương thức handleRoute
        window.addEventListener('hashchange', this.handleRouteBound);
    }

    handleRoute() {
        const hash = window.location.hash.substring(1);
        
        let content = '';

        switch (hash) {
            case 'home':
                const homePage = new HomePage();
                const homePageContent = homePage.render();
                content = homePageContent;
                break;
            case 'about':
                const aboutPage = new AboutPage();
                const aboutPageContent = aboutPage.render();
                content = aboutPageContent;
                break;
            default:
                content = 'default';
                break;
        }

        this.appElement.innerHTML = content;
    }
}