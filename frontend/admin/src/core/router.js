// ./src/core.router.js

import { routes } from "../routes";
import { eventEmitterInstance } from "../utils/event-emitter";
function tt(t) {
    console.log(t)
}
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
        this.eventEmitterInstance = eventEmitterInstance;
    }

    async renderContent(content) {
        const contentElement = document.querySelector('main div.content');
        if (!contentElement) {
            console.error('no main div.content');
            return;
        }
        contentElement.innerHTML = content;
    }

    async navigateTo(path) {
        this.currentPath = path;
        //console.log(this.currentPath)
        let matchedRoute = null;
        let params = {};

        for (const routePath in this.routes) {
            const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
            //tt(routeRegex)
            const potentialMatch = this.currentPath.match(routeRegex) || '/admin/404/'.match(routeRegex);
            //tt(potentialMatch)
            if (potentialMatch) {
                params = potentialMatch.groups || {};
                matchedRoute = this.routes[routePath];
                break;
            }
        }

        if (matchedRoute) {
            //tt(matchedRoute)
            // tt(params)
            try {
                //const module = await import(`../templates/${matchedRoute.replace('@views/', '')}`);
                //const module = await import(/* webpackChunkName: "view-[request]" */ `../templates/${matchedRoute.file.replace('@views/', '')}`);
                const module = await import(/* webpackChunkName: "view-[request]" */ `../views/${matchedRoute.replace('@views/', '')}`);
                const viewComponent = module.default;
                const viewInstance = new viewComponent(params);
                const content = await viewInstance.render();
                //tt(content)
                await this.renderContent(content);
                if (matchedRoute === '@views/not-found.js') {
                    window.history.replaceState(null,null,'/admin/404/');
                }
            } catch (error) {
                console.error(`router.js: Không thể tải hoặc render view cho đường dẫn '${matchedRoute}':`, error)
            }
        }
        this.eventEmitterInstance.emit('routeChange', this.currentPath);
    }

    // click a[route]

    setupRouterListeners() {
        document.addEventListener('click', (e)=>{
            const routeLink = e.target.closest('a[route]');
            if (routeLink) {
                e.preventDefault();
                // path
                const path = e.target.getAttribute('href');
                if (window.location.pathname !== path) {
                    window.history.pushState(null,null,path);
                }

                // navigateTo -> path
                this.navigateTo(path);
            }
        })
        // quay lai / tien len cua trinh duyet
        window.addEventListener('popstate', ()=>{
            this.navigateTo(window.location.pathname)
        })
    }

    init() {
        this.setupRouterListeners();
        // mac dinh tai trang lan dau
        this.navigateTo(this.currentPath)
    }
}

export const routerInstance = new Router(routes);