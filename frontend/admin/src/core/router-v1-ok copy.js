// ./src/core/router.js
import { routes } from "../routes";


class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
    }

    async navigateTo(path) {
        this.currentPath = path;
        let matchedRoute = null;
        let params = {};
        //console.log(this.currentPath);

        for (const routePath in this.routes) {
            const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
            const potentialMatch = this.currentPath.match(routeRegex);

            if (potentialMatch) {
                params = potentialMatch.groups || {};
                matchedRoute = this.routes[routePath]; // Attach params directly to the matchedRoute object
                break;
            }
            // if (potentialMatch) {
            //     params = potentialMatch.groups || {};
            //     // Create a new object that includes the original route data and the extracted params
            //     matchedRoute = {
            //         ...this.routes[routePath], // Copy all properties from the original route definition
            //         params: params             // Add the extracted params
            //     };
            //     break;
            // }
        }

        if (matchedRoute) {
            console.log("Matched Route:", matchedRoute);
            console.log("Extracted Params:", params);
            // Now you can use matchedRoute and params to render a component or call a handler
            // e.g., this.renderComponent(matchedRoute.component, params);
        }
    }

    init() {
        //console.log(this.routes)
        this.navigateTo(this.currentPath);
    }
}


export const routerInstance = new Router(routes);