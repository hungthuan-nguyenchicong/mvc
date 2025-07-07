// ./src/core.router.js

import { routes } from "../routes";
function tt(t) {
    console.log(t)
}
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
    }

    async renderContent(content) {
        const contentElement = document.querySelector('main div.content');
        if (!contentElement) {
            console.error('no main div.content');
            return;
        }
        contentElement.innerHTML = content;
    }

    // ... (Router class and other methods)

async navigateTo(path) {
    let matchedRoute = null;
    let params = {};
    let finalPath = path; // The path we will actually navigate to

    for (const routePath in this.routes) {
        const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
        const potentialMatch = finalPath.match(routeRegex);
        if (potentialMatch) {
            params = potentialMatch.groups || {};
            matchedRoute = this.routes[routePath];
            break;
        }
    }

    // Handle 404 if no route matched
    if (!matchedRoute) {
        matchedRoute = this.routes['/404'];
        finalPath = '/404'; // Update finalPath to /404
        window.history.replaceState(null, null, finalPath); // Replace current history entry with 404
    } else {
        // If a route was matched and it's not the current path in history, push a new state
        // This handles cases where navigateTo is called directly or from a link click
        if (window.location.pathname !== finalPath) {
            window.history.pushState(null, null, finalPath);
        }
    }

    // Update currentPath after history manipulation and final path determination
    this.currentPath = finalPath;

    if (matchedRoute) {
        try {
            const module = await import(/* webpackChunkName: "view-[request]" */ `../views/${matchedRoute.replace('@views/', '')}`);
            const viewComponent = module.default;
            const viewInstance = new viewComponent(params);
            const content = await viewInstance.render();
            await this.renderContent(content);

            // Optional: Scroll to top after content renders
            //window.scrollTo(0, 0);

        } catch (error) {
            console.error(`Router.js: Could not load or render view for path '${matchedRoute}':`, error);
            // Optionally navigate to an error page or show an error message
            // You might want a specific error view in your routes for this
            // this.navigateTo('/error');
        }
    }
}

    // click a[route]

    setupRouterListeners() {
        document.addEventListener('click', (e)=>{
            const routeLink = e.target.closest('a[route]');
            if (routeLink) {
                e.preventDefault();
                // path

                //const keyRoutes = Object.keys(this.routes);
                //tt(keyRoutes)
                const path = e.target.getAttribute('href');
                //tt(keyRoutes)
                // tt(keyRoutes.indexOf(path))
                // if (window.location.pathname !== path) {
                //     window.history.pushState(null,null,path);
                // }
                // tt(window.location.pathname)
                //tt(this.currentPath === '/404')
                // navigateTo -> path
                this.navigateTo(path);

                // if (window.location.pathname === path) {
                //     //console.log("Router.js: Đang nhấp vào đường dẫn hiện tại, đang render lại.");
                //     this.navigateTo(path);
                //     return;
                // }

                // history.pushState(null, '', path);
                // this.navigateTo(path);
            }
        })
        // quay lai / tien len cua trinh duyet
        window.addEventListener('popstate', ()=>{
            this.navigateTo(window.location.pathname);
        })
    }

    init() {
        this.setupRouterListeners();
        // mac dinh tai trang lan dau
        this.navigateTo(this.currentPath)
    }
}

export const routerInstance = new Router(routes);