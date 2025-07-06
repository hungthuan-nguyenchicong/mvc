// ./src/core/router.js

//const viewContext = require.context('../templates', true, /\.js$/);

class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
    }

    renderContent(content) {
        const mainContent = document.querySelector('div.main-content');
        if (!mainContent) {
            console.error('no div.main-content');
            return;
        }
        mainContent.innerHTML = content;
    }

    async navigateTo(path) {
        this.currentPath = path;
        //console.log("Router.js: Đang điều hướng đến đường dẫn:", path);

        let matchedRoute = null;
        let params = {};

        for (const routePath in this.routes) {
            const routeDetails = this.routes[routePath];
            // Escape forward slashes and replace {param} with a named capture group
            //const routeRegex = new RegExp(`^${routePath.replace(/\//g, '\\/').replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
            const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);

            const potentialMatch = path.match(routeRegex);

            if (potentialMatch) {
                matchedRoute = { ...routeDetails }; // Create a copy to avoid modifying the original route object
                params = potentialMatch.groups || {};
                matchedRoute.params = params; // Attach params directly to the matchedRoute object
                break;
            }
        }

        // if (matchedRoute) {
        //     try {
        //         // Update the document title based on the view property
        //         document.title = matchedRoute.view || 'Default Title';

        //         const relativePathInContext = matchedRoute.file.replace('@views/', './');
        //         //console.log("Router.js: Đang cố gắng tải động từ context:", relativePathInContext);
        //         const module = await viewContext(relativePathInContext);

        //         const ViewComponent = module.default;
        //         const viewInstance = new ViewComponent(matchedRoute.params); // Pass params to the view constructor
        //         const content = await viewInstance.render();
                
        //         this.renderContent(content);
        //     } catch (error) {
        //         //console.error(`Router.js: Không thể tải hoặc render view cho đường dẫn '${path}':`, error);
        //         // If there's an error loading the specific view, redirect to 404
        //         this.navigateTo('/404');
        //     }
        // } else {
        //     // No route matched, navigate to 404 page
        //     //console.log("Router.js: Không tìm thấy đường dẫn phù hợp, điều hướng đến /404.");
        //     this.navigateTo('/404');
        // }



        // Inside your navigateTo method
    // ...
        if (matchedRoute) {
            try {
                document.title = matchedRoute.view || 'Default Title';

                // Use dynamic import for true lazy loading
                // Webpack will create separate chunks for these modules
                const module = await import(/* webpackChunkName: "view-[request]" */ `../templates/${matchedRoute.file.replace('@views/', '')}`);

                const ViewComponent = module.default;
                const viewInstance = new ViewComponent(matchedRoute.params);
                const content = await viewInstance.render();

                this.renderContent(content);
            } catch (error) {
                this.navigateTo('/404');
            }
        }  else {
                // No route matched, navigate to 404 page
                //console.log("Router.js: Không tìm thấy đường dẫn phù hợp, điều hướng đến /404.");
                this.navigateTo('/404');
        }


    }

    init() {
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[route]');
            if (routeLink) {
                e.preventDefault();
                const path = routeLink.getAttribute('href');

                if (window.location.pathname === path) {
                    console.log("Router.js: Đang nhấp vào đường dẫn hiện tại, đang render lại.");
                    this.navigateTo(path);
                    return;
                }

                history.pushState(null, '', path);
                this.navigateTo(path);
            }
        });

        this.navigateTo(this.currentPath);
    }
}

export const routerInstance = new Router(); // Pass routes here