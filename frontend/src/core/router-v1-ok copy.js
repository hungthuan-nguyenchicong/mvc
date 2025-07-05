// ./src/core/router.js

const viewContext = require.context('../templates', true, /\.js$/);

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

    // ... inside your navigateTo method
    async navigateTo(path) {
        this.currentPath = path;
        console.log("Router.js: Đang điều hướng đến đường dẫn:", path);

        let matchedRoute = null;
        let params = {};
        //console.log(this.routes);

        // Change this line:
        for (const routePath in this.routes) { // Iterate over keys of the routes object
            const routeDetails = this.routes[routePath]; // Get the route details (value)
            const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
            const potentialMatch = path.match(routeRegex);
            //console.log(potentialMatch);

            if (potentialMatch) {
                // if the route itself is a function, call it to get the route details
                if (typeof routeDetails === 'function') { // Use routeDetails here
                    params = potentialMatch.groups || {};
                    matchedRoute = routeDetails(params); // Call the function to get title and content
                } else {
                    matchedRoute = routeDetails; // Assign the static route object
                }
                break;
            }
        }

        //console.log(matchedRoute);

        if (matchedRoute) {
            //console.log(matchedRoute);
            // You'll likely want to render your view here based on matchedRoute
            // For example: this.renderView(matchedRoute.file, params);
            try {
                const relativePathInContext = matchedRoute.file.replace('@views/', './');
                console.log("Router.js: Đang cố gắng tải động từ context:", relativePathInContext);
                const module = await viewContext(relativePathInContext);
                // const viewInstance = module.homeInstance; // Access the named export
                // const content = await viewInstance.render();
                // Then append 'content' to your DOM
                // ...
                const ViewComponent = module.default;
                const viewInstance = new ViewComponent(matchedRoute.params); // Instantiate it
                const content = await viewInstance.render();
                //console.log(content)
                this.renderContent(content);
            } catch (error) {
                console.error(`Router.js: Không thể tải hoặc render view cho đường dẫn '${path}':`, error)
            }
        }
    }

    init() {
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[router]');
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

export const routerInstance = new Router();