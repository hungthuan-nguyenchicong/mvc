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

    async navigateTo(path) {
        this.currentPath = path;
        //console.log(this.currentPath)
        let matchedRoute = null;
        let params = {};

        for (const routePath in this.routes) {
            const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
            //tt(routeRegex)
            const potentialMatch = this.currentPath.match(routeRegex) || '/404'.match(routeRegex);
            //tt(potentialMatch)
            if (potentialMatch) {
                params = potentialMatch.groups || {};
                matchedRoute = this.routes[routePath];
                break;
            }
        }

        if (matchedRoute) {
            tt(matchedRoute)
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
            } catch (error) {
                console.error(`router.js: Không thể tải hoặc render view cho đường dẫn '${matchedRoute}':`, error)
            }
        }
    }

    init() {
        this.navigateTo(this.currentPath)
    }
}

export const routerInstance = new Router(routes);