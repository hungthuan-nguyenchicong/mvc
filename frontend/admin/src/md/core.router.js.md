# core.router.js
Bạn đang gặp lỗi 404 vì URL bạn đang nhập ( /admin/views/?view=posts/post-show&id=567) không khớp với định nghĩa tuyến đường ( 'posts/post-show&{id}') trong routesđối tượng.

Nguyên nhân là do xung đột trong cách cấu hình bộ định tuyến để diễn giải các tuyến đường có tham số và cách trình duyệt web xử lý các tham số truy vấn.

Tại sao trận đấu thất bại
Định nghĩa bộ định tuyến: Tuyến đường được định nghĩa là 'posts/post-show&{id}'. Biểu thức chính quy của bộ định tuyến mong đợi ID là một phần của giá trị viewtham số, được kết nối bằng dấu & (ví dụ: ?view=posts/post-show&567).

Đầu vào URL của bạn: Khi bạn nhập /admin/views/?view=posts/post-show&id=567, trình duyệt sẽ URLSearchParamsnhận dạng view=posts/post-showvà id=567là hai tham số truy vấn riêng biệt .

Bộ định tuyến nhìn thấy: Dữ liệu viewParamđược bộ định tuyến lấy về chỉ là posts/post-show.

Không khớp: Bộ định tuyến cố gắng khớp posts/post-showvới biểu thức chính quy for 'posts/post-show&{id}'(tìm kiếm ^posts/post-show&[a-zA-Z0-9-]+$). Vì posts/post-showkhông chứa &và ID nên việc khớp không thành công và bộ định tuyến mặc định là 404.

Bản sửa lỗi: Cập nhật Định nghĩa Tuyến đường và Xử lý Tham số
Để khắc phục điều này, chúng ta cần điều chỉnh bộ định tuyến để coi nó id=567như một tham số truy vấn chuẩn trong khi vẫn sử dụng view=posts/post-showđể khớp tuyến.

Chúng tôi sẽ sửa đổi routesđịnh nghĩa và MapsTophương pháp để nắm bắt chính xác idcác tham số tìm kiếm từ URL và truyền nó vào chế độ xem.

JavaScript

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

    init() {
        this.navigateTo(this.currentPath + this.queryString);
    }
}

export const routerInstance = new Router(routes);

## ver 2 click link

// ./src/core.router.js

const routes = {
    'home': '@views/home.js',
    'posts/post-index': '@views/posts/post-index.js',
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

        // --- FIX: Update internal queryString and searchParams based on the new path ---
        // This is necessary because navigating via a link changes the URL, and we need 
        // to parse the parameters from the new path.
        try {
            // Use URL constructor to parse the path (including potential query strings)
            const url = new URL(path, window.location.origin);
            this.queryString = url.search;
            this.searchParams = new URLSearchParams(this.queryString);
        } catch (e) {
            console.error(`Invalid URL path provided to navigateTo: ${path}`, e);
        }
        // -----------------------------------------------------------------------------

        console.log(`Current path: ${this.currentPath}`);
        console.log(`Query string: ${this.queryString}`);
        
        let matchedRouteFile = null;
        let params = {}; 

        // Extract the 'view' parameter from the updated searchParams.
        let viewParam = this.searchParams.get('view');

        // --- FIX: Explicitly default viewParam to 'home' if no 'view' parameter is present ---
        // This handles URLs like /admin/views/ or /admin/views/?
        if (!viewParam) {
            viewParam = 'home';
        }
        // ------------------------------------------------------------------------------------
        
        console.log(`View parameter: ${viewParam}`);

        // Capture all URL search parameters (excluding 'view')
        for (const [key, value] of this.searchParams.entries()) {
            if (key !== 'view') {
                params[key] = value;
            }
        }

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
        // quay lai / tien len cua trinh duyet
        window.addEventListener('popstate', ()=>{
            this.navigateTo(window.location.pathname)
        });
    }

    init() {
        this.setupRouterListeners();
        // Use the current path and the initial queryString (which defaults to ?view=home) for the first navigation
        this.navigateTo(this.currentPath + this.queryString); 
    }
}

export const routerInstance = new Router(routes);