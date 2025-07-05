// src/core/Router.js
import { appEvents } from "../utils/EventEmitter.js";

// ***** NƠI THAY ĐỔI LỚN NHẤT: ĐỊNH NGHĨA CONTEXT CHO CÁC VIEW *****
// require.context(directory, useSubdirectories, regExp, mode);
// Đây là cách Webpack biết tĩnh tất cả các module có thể được import động từ thư mục 'src/views'
// ('.'): thư mục hiện tại của context (webpack.config.js của bạn định nghĩa '@views' trỏ tới 'src/views')
// true: bao gồm các thư mục con
// /\.js$/: chỉ bao gồm các file .js
// const viewContext = require.context('../../src/views', true, /\.js$/);
const viewContext = require.context('../views', true, /\.js$/);

// Hoặc, nếu alias của bạn được cấu hình tốt đến mức nó có thể được sử dụng ở đây
// const viewContext = require.context('@views', true, /\.js$/);
// Tuy nhiên, đường dẫn tương đối ../../src/views thường đáng tin cậy hơn cho require.context.
// Dựa trên cấu trúc file của bạn Router.js (src/core/Router.js) thì ../../src/views là đúng.
// *******************************************************************


export class Router {
    constructor(routes) {
        this.appEvents = appEvents;
        this.routes = routes;
        this.currentPath = window.location.pathname;
    }

    async navigateTo(path) {
        this.currentPath = path;
        console.log("Router.js: Đang điều hướng đến đường dẫn:", path);

        let matchedRoute = null;
        let routeParams = {};

        for (const route of this.routes) {
            const routePathRegex = new RegExp(`^${route.path.replace(/\{([a-zA-Z0-9_]+)\}/g, '([a-zA-Z0-9_]+)')}$`);
            const match = path.match(routePathRegex);

            if (match) {
                matchedRoute = route;
                const paramValues = match.slice(1);
                const paramNames = (route.path.match(/\{([a-zA-Z0-9_]+)\}/g) || []).map(name => name.substring(1, name.length - 1));

                routeParams = paramValues.reduce((acc, val, index) => {
                    if (paramNames[index]) {
                        acc[paramNames[index]] = val;
                    } else {
                        acc[`param${index}`] = val;
                    }
                    return acc;
                }, {});
                break;
            }
        }

        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error("Router.js: Không tìm thấy phần tử có id 'content' để render nội dung.");
            return;
        }

        contentDiv.innerHTML = '';
        contentDiv.textContent = 'Đang tải...';

        if (matchedRoute) {
            try {
                // ***** THAY ĐỔI CÁCH TẢI ĐỘNG MODULE *****
                // Chuyển đổi đường dẫn alias thành đường dẫn tương đối trong context của Webpack
                // Ví dụ: '@views/Home.js' -> './Home.js'
                // Hoặc '@views/posts/PostIndex.js' -> './posts/PostIndex.js'
                const relativePathInContext = matchedRoute.file.replace('@views/', './');
                console.log("Router.js: Đang cố gắng tải động từ context:", relativePathInContext);

                // Sử dụng viewContext để tải module
                // Webpack đã phân tích tất cả các file trong context tĩnh,
                // nên nó sẽ tìm thấy module này dễ dàng hơn.
                const module = await viewContext(relativePathInContext);
                // ********************************************

                const ViewComponent = module.default;

                if (typeof ViewComponent === 'function' && ViewComponent.prototype && ViewComponent.prototype.constructor === ViewComponent) {
                    const instance = new ViewComponent(routeParams);
                    let viewContent;

                    if (typeof instance.render === 'function') {
                        viewContent = instance.render();
                    } else if (typeof instance.getHtml === 'function') {
                        viewContent = await instance.getHtml(routeParams);
                    } else {
                        console.error(`Router.js: Component view for '${path}' does not have a 'render()' or 'getHtml()' method.`);
                        contentDiv.innerHTML = '<h1>Lỗi: Component view không đúng định dạng.</h1><p>Thiếu phương thức render() hoặc getHtml().</p>';
                        return;
                    }

                    contentDiv.innerHTML = '';
                    if (typeof viewContent === 'string') {
                        contentDiv.innerHTML = viewContent;
                    } else if (viewContent instanceof Element || viewContent instanceof DocumentFragment) {
                        contentDiv.appendChild(viewContent);
                    } else {
                        console.error(`Router.js: View component '${matchedRoute.view}' for path '${path}' returned an invalid type for content.`, viewContent);
                        contentDiv.innerHTML = '<h1>Lỗi: Nội dung View không hợp lệ.</h1>';
                    }

                    if (typeof instance.attachEvents === 'function') {
                        instance.attachEvents();
                    } else if (typeof instance.init === 'function') {
                        instance.init();
                    }

                } else {
                    console.error(`Router.js: Imported view '${matchedRoute.view}' for path '${path}' is not a valid component class (received:`, ViewComponent, `).`);
                    contentDiv.innerHTML = '<h1>Lỗi: Không thể tải view.</h1><p>Vui lòng kiểm tra console để biết chi tiết.</p>';
                }
            } catch (error) {
                console.error(`Router.js: Không thể tải hoặc render view cho đường dẫn '${path}':`, error);
                contentDiv.innerHTML = `<h1>Lỗi tải trang</h1><p>Không thể tải nội dung cho ${path}. Vui lòng thử lại.</p><p>${error.message}</p>`;
            }
        } else {
            console.log("Router.js: Không tìm thấy tuyến đường cho đường dẫn:", path);
            contentDiv.innerHTML = '<h1>404 - Không tìm thấy trang</h1><p>Trang bạn đang tìm không tồn tại.</p>';
        }
        this.appEvents.emit('pathChanged', this.currentPath);
    }

    init() {
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[data-link]');
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