// ./src/core.router.js

const routes = {
    'home': '@views/home.js',
    'posts/post-index': '@views/posts/post-index.js',
    // We remove the &{id} from the key definition, as we will extract 'id' from searchParams.
    'posts/post-show': '@views/posts/post-show.js', 
    '404': '@views/not-found.js'
}

class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPath = window.location.pathname;
        console.log('1. window.location.search:', window.location.search);

        this.queryString = window.location.search || '?view=home';

        console.log('2. this.queryString after assignment:', this.queryString);
        this.searchParams = new URLSearchParams(this.queryString);
    }

    async renderContent(content) {
        const contentElement = document.querySelector('.content');
        if (!contentElement) {
            console.error('No main>div.content');
            return;
        }
        contentElement.innerHTML = content;
    }

    async navigateTo(path) {
        this.currentPath = path;
        console.log(`Navigating to: ${path}`);
        console.log(`Current path: ${this.currentPath}`);
        console.log(`Query string: ${this.queryString}`);
        console.log(`View parameter: ${this.searchParams.get('view')}`);

        let matchedRouteFile = null;
        let params = {}; 
        const viewParam = this.searchParams.get('view');
        console.log(viewParam);

        // --- Fix 1: Capture all URL search parameters (excluding 'view') ---
        // This ensures parameters like 'id=567' are available in the 'params' object.
        for (const [key, value] of this.searchParams.entries()) {
            if (key !== 'view') {
                params[key] = value;
            }
        }
        // ------------------------------------------------------------------

        // Iterate through routes to find a match for viewParam
        for (const routePath in this.routes) {
            if (routePath === '404') continue; 
            
            // Modify regex creation to handle potential parameters in the routePath
            const routeRegex = new RegExp(`^${routePath.replace(/{([a-zA-Z0-9-]+)}/g, '(?<$1>[a-zA-Z0-9-]+)')}$`);
            
            // Attempt to match the view parameter against the route regex
            const potentialMatch = viewParam ? viewParam.match(routeRegex) : null;

            if (potentialMatch) {
                // Merge any regex-captured groups into the params object
                Object.assign(params, potentialMatch.groups); 
                matchedRouteFile = this.routes[routePath];
                break; // Stop iterating once a match is found
            }
        }

        // If no route was matched, use the 404 fallback
        if (!matchedRouteFile) {
            matchedRouteFile = this.routes['404'];
        }

        if (matchedRouteFile) {
            console.log(matchedRouteFile)
            try {
                // Dynamically import the view module
                const module = await import(/* webpackChunkName: "view-[request]" */ `../views/${matchedRouteFile.replace('@views/', '')}`);
                const viewComponent = module.default;
                
                // Pass the 'params' object (containing 'id' from the URL) to the view component
                const viewInstance = new viewComponent(params); 
                const content = await viewInstance.render();
                console.log(matchedRouteFile)
                
                // render content
                await this.renderContent(content);
                
                // Update history state to ?view=404 if the 404 page was loaded due to a mismatch
                if (matchedRouteFile === '@views/not-found.js') {
                    window.history.replaceState(null,null,'/admin/views/?view=404');
                } 
            } catch (error) {
                console.error(`router.js: Không thể tải hoặc render view cho đường dẫn '${matchedRouteFile}':`, error)
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
                const path = e.target.getAttribute('href');
                // console.log(`'path: '. ${path}`);
                // if (window.location.pathname !== path) {
                    window.history.pushState(null, null, path);
                // }
                
                // navigateTo -> path
                this.navigateTo(path);
            }
        })
    }

    init() {
        this.setupRouterListeners();
        this.navigateTo(this.currentPath + this.queryString);
    }
}

export const routerInstance = new Router(routes);