## Router.js - Giải Thích Chi Tiết Từng Đoạn Mã

Certainly! Let's break down the Router.js file section by section, explaining its purpose and the role of each method.

Router.js - Giải Thích Chi Tiết Từng Đoạn Mã
File Router.js này là một thành phần core của ứng dụng, chịu trách nhiệm quản lý định tuyến (routing) phía client-side. Nó cho phép bạn tạo ra các "trang" ảo mà không cần tải lại toàn bộ trang từ máy chủ, mang lại trải nghiệm người dùng mượt mà hơn như một ứng dụng một trang (Single Page Application - SPA).

JavaScript

import { appEvents } from "../utils/EventEmitter.js";

export class Router {
    constructor(routes) {
        this.appEvents = appEvents;
        this.routes = routes;
        this.currentPath = window.location.pathname; // Initialize currentPath
        // No explicit 'init()' call here; it will be called from main.js
    }
1. constructor(routes)
Mục đích: Hàm constructor là nơi khởi tạo đối tượng Router. Nó nhận vào một mảng các định nghĩa routes (tức là các đường dẫn và thành phần giao diện tương ứng của chúng).

Giải thích chi tiết:

this.appEvents = appEvents;: Gán đối tượng appEvents (được import từ EventEmitter.js) vào thuộc tính appEvents của router. EventEmitter là một cơ chế cho phép các thành phần khác nhau của ứng dụng giao tiếp với nhau bằng cách phát ra và lắng nghe các sự kiện tùy chỉnh. Router sẽ sử dụng nó để thông báo khi đường dẫn (path) thay đổi.

this.routes = routes;: Lưu trữ mảng routes (các cấu hình đường dẫn của ứng dụng) được truyền vào khi khởi tạo router. Mảng này sẽ được sử dụng để khớp đường dẫn hiện tại với một route đã định nghĩa.

this.currentPath = window.location.pathname;: Khởi tạo thuộc tính currentPath với đường dẫn URL hiện tại của trình duyệt (window.location.pathname). Điều này đảm bảo router biết đường dẫn ban đầu khi ứng dụng được tải lần đầu.

// No explicit 'init()' call here; it will be called from main.js: Đây là một ghi chú quan trọng. Nó cho biết rằng phương thức init() (sẽ được giải thích sau) không được gọi trực tiếp trong constructor. Thay vào đó, nó sẽ được gọi từ một file khác (ví dụ: main.js) sau khi router đã được khởi tạo hoàn chỉnh. Điều này giúp tách biệt việc khởi tạo đối tượng với việc thiết lập các listener sự kiện.

JavaScript

    // This method will handle both route matching and dynamic rendering
    async navigateTo(path) {
        this.currentPath = path;
        console.log("Router.js: Navigating to path:", path);

        // Find the route that matches the current path, including parameters
        let matchedRoute = null;
        let routeParams = {}; // Use an object for named parameters if your route.path uses {paramName}

        for (const route of this.routes) {
            // Convert route path to a regex to match and capture parameters
            // Example: /posts/{id} -> /posts/([a-zA-Z0-9_]+)
            const routePathRegex = new RegExp(`^${route.path.replace(/\{([a-zA-Z0-9_]+)\}/g, '([a-zA-Z0-9_]+)')}$`);
            const match = path.match(routePathRegex);

            if (match) {
                matchedRoute = route;
                // Extract parameter values and potentially map them to names from the route path
                const paramValues = match.slice(1);
                const paramNames = (route.path.match(/\{([a-zA-Z0-9_]+)\}/g) || []).map(name => name.substring(1, name.length - 1));

                routeParams = paramValues.reduce((acc, val, index) => {
                    if (paramNames[index]) {
                        acc[paramNames[index]] = val;
                    } else {
                        // For unmatched or unnamed regex groups, add as indexed if needed
                        acc[`param${index}`] = val;
                    }
                    return acc;
                }, {});
                break;
            }
        }
2. async navigateTo(path) - Phần 1: Khớp Route và Trích xuất Tham số
Mục đích: Đây là phương thức cốt lõi của router, chịu trách nhiệm điều hướng đến một đường dẫn mới, tìm route phù hợp, trích xuất các tham số (nếu có), và chuẩn bị để render thành phần giao diện tương ứng.

Giải thích chi tiết:

this.currentPath = path;: Cập nhật currentPath của router với đường dẫn mới được yêu cầu điều hướng đến.

console.log("Router.js: Navigating to path:", path);: Một log thông báo việc điều hướng đang diễn ra, hữu ích cho việc debug.

Tìm kiếm matchedRoute và routeParams:

let matchedRoute = null;: Biến để lưu trữ route được tìm thấy khớp với đường dẫn hiện tại.

let routeParams = {};: Đối tượng để lưu trữ các tham số được trích xuất từ URL (ví dụ: id trong /posts/123).

for (const route of this.routes) { ... }: Vòng lặp duyệt qua tất cả các route đã được định nghĩa trong this.routes.

const routePathRegex = new RegExp(^route.path.replace(/([a−zA−Z0−9_]+)/g, 
′
 ([a−zA−Z0−9_]+) 
′
 ));: Đây là phần quan trọng nhất của việc khớp route. Nó chuyển đổi đường dẫn route đã định nghĩa (ví dụ: /posts/{id}) thành một biểu thức chính quy (Regular Expression) để có thể khớp với URL thực tế và bắt các giá trị tham số.

replace(/\{([a-zA-Z0-9_]+)\}/g, '([a-zA-Z0-9_]+)'): Tìm kiếm các chuỗi dạng {paramName} và thay thế chúng bằng ([a-zA-Z0-9_]+). Điều này tạo ra một nhóm bắt giữ (capturing group) trong regex, cho phép trích xuất giá trị của tham số. [a-zA-Z0-9_]+ là một regex cơ bản khớp với một hoặc nhiều ký tự chữ cái, số hoặc dấu gạch dưới.

^...$: Đảm bảo rằng regex khớp toàn bộ đường dẫn từ đầu (^) đến cuối ($), tránh các trường hợp khớp một phần.

const match = path.match(routePathRegex);: Thực hiện khớp đường dẫn path (đường dẫn hiện tại) với routePathRegex đã tạo. Nếu khớp, match sẽ là một mảng chứa toàn bộ chuỗi khớp và các nhóm bắt giữ (tham số).

if (match) { ... break; }: Nếu tìm thấy một route khớp:

matchedRoute = route;: Lưu lại đối tượng route đã khớp.

const paramValues = match.slice(1);: Lấy các giá trị tham số từ mảng match. Phần tử đầu tiên của match là toàn bộ chuỗi khớp, các phần tử tiếp theo là các nhóm bắt giữ (tham số).

const paramNames = (route.path.match(/\{([a-zA-Z0-9_]+)\}/g) || []).map(name => name.substring(1, name.length - 1));: Trích xuất tên của các tham số từ đường dẫn route đã định nghĩa (ví dụ: từ {id} lấy ra id).

routeParams = paramValues.reduce(...): Gán các giá trị tham số đã trích xuất vào một đối tượng routeParams với các tên tham số tương ứng (ví dụ: { id: '123' }). Nếu có tham số không tên hoặc không khớp được tên, nó sẽ được gán bằng paramN.

break;: Dừng vòng lặp ngay khi tìm thấy route đầu tiên khớp.

JavaScript

        const contentDiv = document.getElementById('content');
        if (!contentDiv) {
            console.error("Router.js: No element with id 'content' found to render content.");
            return;
        }

        contentDiv.innerHTML = ''; // Clear previous content
        contentDiv.textContent = 'Loading...'; // Show loading indicator

        if (matchedRoute) {
            try {
                // Dynamically import the module specified by 'file' in your route
                // Example: import('./views/posts/PostIndex.js')
                const module = await import(matchedRoute.file);

                // Assuming your view components are exported as default classes (e.g., export default class PostIndex { ... })
                const ViewComponent = module.default;

                if (typeof ViewComponent === 'function' && ViewComponent.prototype && ViewComponent.prototype.constructor === ViewComponent) {
                    // Instantiate the component, passing parameters to its constructor if it accepts them
                    const instance = new ViewComponent(routeParams); // Pass extracted parameters here

                    // Check for a 'render' or 'getHtml' method and call it
                    let viewContent;
                    if (typeof instance.render === 'function') {
                        viewContent = instance.render();
                    } else if (typeof instance.getHtml === 'function') { // Support your original getHtml if preferred
                        viewContent = await instance.getHtml(routeParams); // Pass params to getHtml
                    } else {
                        console.error(`Router.js: View component for '${path}' does not have a 'render()' or 'getHtml()' method.`);
                        contentDiv.innerHTML = '<h1>Error: View component malformed.</h1><p>Missing render() or getHtml() method.</p>';
                        return;
                    }

                    contentDiv.innerHTML = ''; // Clear loading indicator
                    // Append the content. If render/getHtml returns a string, use innerHTML; else, append as node.
                    if (typeof viewContent === 'string') {
                        contentDiv.innerHTML = viewContent;
                    } else if (viewContent instanceof Element || viewContent instanceof DocumentFragment) {
                        contentDiv.appendChild(viewContent);
                    } else {
                        console.error(`Router.js: View component '${matchedRoute.view}' for path '${path}' returned an invalid type for content.`, viewContent);
                        contentDiv.innerHTML = '<h1>Error: Invalid View Content.</h1>';
                    }

                    // Attach events after the HTML has been rendered into the DOM
                    if (typeof instance.attachEvents === 'function') { // Support your original attachEvents
                        instance.attachEvents();
                    } else if (typeof instance.init === 'function') { // Support your original init
                        instance.init();
                    }

                } else {
                    console.error(`Router.js: Imported view '${matchedRoute.view}' for path '${path}' is not a valid component class (received:`, ViewComponent, `).`);
                    contentDiv.innerHTML = '<h1>Error: Unable to load view.</h1><p>Please check the console for details.</p>';
                }
            } catch (error) {
                console.error(`Router.js: Failed to load or render view for path '${path}':`, error);
                contentDiv.innerHTML = `<h1>Error Loading Page</h1><p>Could not load content for ${path}. Please try again.</p><p>${error.message}</p>`;
            }
        } else {
            console.log("Router.js: No route matched for path:", path);
            contentDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>';
        }
        // Emit path change event after content is rendered
        this.appEvents.emit('pathChanged', this.currentPath);
    }
3. async navigateTo(path) - Phần 2: Render Nội dung
Mục đích: Sau khi tìm thấy route phù hợp, phần này của phương thức MapsTo sẽ tải động thành phần giao diện, tạo một instance của nó, gọi phương thức render, và chèn nội dung vào DOM.

Giải thích chi tiết:

const contentDiv = document.getElementById('content');: Lấy tham chiếu đến phần tử DOM có id="content". Đây là nơi nội dung của các view sẽ được render.

Kiểm tra và hiển thị loading:

if (!contentDiv) { ... return; }: Kiểm tra xem phần tử content có tồn tại không. Nếu không, log lỗi và dừng lại.

contentDiv.innerHTML = '';: Xóa nội dung cũ để tránh hiển thị nội dung của trang trước.

contentDiv.textContent = 'Loading...';: Hiển thị một thông báo "Loading..." cho người dùng trong khi thành phần view đang được tải và render.

if (matchedRoute) { ... }: Nếu có một route khớp được tìm thấy:

try { ... } catch (error) { ... }: Khối try...catch để bắt lỗi trong quá trình tải hoặc render view, giúp ứng dụng không bị crash và hiển thị thông báo lỗi thân thiện.

const module = await import(matchedRoute.file);: Đây là tính năng dynamic import của JavaScript. Nó cho phép tải module (file JavaScript) một cách động chỉ khi cần thiết. matchedRoute.file sẽ chứa đường dẫn đến file JavaScript của view component (ví dụ: './views/posts/PostIndex.js').

const ViewComponent = module.default;: Các view component được mong đợi là được xuất (export) dưới dạng default trong file module của chúng.

if (typeof ViewComponent === 'function' && ViewComponent.prototype && ViewComponent.prototype.constructor === ViewComponent) { ... }: Kiểm tra xem ViewComponent có thực sự là một lớp (class) hợp lệ hay không.

const instance = new ViewComponent(routeParams);: Tạo một thể hiện (instance) mới của lớp view component. Các tham số đường dẫn (routeParams) được truyền vào constructor của view component, cho phép view truy cập dữ liệu từ URL (ví dụ: id của bài viết).

Gọi phương thức render/getHtml:

if (typeof instance.render === 'function') { viewContent = instance.render(); }: Ưu tiên gọi phương thức render() nếu có.

else if (typeof instance.getHtml === 'function') { viewContent = await instance.getHtml(routeParams); }: Nếu không có render(), hỗ trợ phương thức getHtml() (có thể là phương thức cũ hơn hoặc thay thế). Phương thức này cũng được truyền routeParams.

else { ... }: Nếu không có cả render() hay getHtml(), log lỗi và hiển thị thông báo lỗi.

contentDiv.innerHTML = '';: Xóa thông báo "Loading...".

Chèn nội dung vào DOM:

if (typeof viewContent === 'string') { contentDiv.innerHTML = viewContent; }: Nếu render() hoặc getHtml() trả về một chuỗi HTML, chèn nó bằng innerHTML.

else if (viewContent instanceof Element || viewContent instanceof DocumentFragment) { contentDiv.appendChild(viewContent); }: Nếu trả về một đối tượng Element (ví dụ: một thẻ HTML) hoặc DocumentFragment (một tập hợp các thẻ HTML), append nó trực tiếp vào contentDiv. Cách này thường hiệu quả hơn về mặt hiệu suất và an toàn hơn so với innerHTML nếu nội dung đã là các node DOM.

else { ... }: Nếu viewContent có kiểu không hợp lệ, log lỗi và hiển thị thông báo lỗi.

Gắn các sự kiện (Attach Events):

if (typeof instance.attachEvents === 'function') { instance.attachEvents(); }: Sau khi nội dung HTML của view đã được chèn vào DOM, router sẽ kiểm tra xem instance của view component có phương thức attachEvents() không. Nếu có, nó sẽ được gọi để gắn các event listener vào các phần tử trong view.

else if (typeof instance.init === 'function') { instance.init(); }: Tương tự, nếu có phương thức init(), nó cũng sẽ được gọi. Điều này đảm bảo rằng view component có thể khởi tạo các logic tương tác của nó sau khi được render.

else { ... }: Nếu ViewComponent không phải là một class hợp lệ, log lỗi và hiển thị thông báo.

else { ... }: Nếu không tìm thấy route nào khớp với đường dẫn, hiển thị trang 404 (Page Not Found).

this.appEvents.emit('pathChanged', this.currentPath);: Phát ra sự kiện pathChanged qua appEvents. Các thành phần khác trong ứng dụng có thể lắng nghe sự kiện này để cập nhật trạng thái của chúng (ví dụ: cập nhật thanh điều hướng hoặc tiêu đề trang).

JavaScript

    // Initial setup for listeners (popstate and click events)
    init() {
        // Handle browser history changes (back/forward buttons)
        window.addEventListener('popstate', () => {
            this.navigateTo(window.location.pathname);
        });

        // Handle clicks on internal navigation links (those with data-link attribute)
        document.body.addEventListener('click', (e) => {
            const routeLink = e.target.closest('a[data-link]');
            if (routeLink) {
                e.preventDefault(); // Prevent default link behavior
                const path = routeLink.getAttribute('href');

                // If navigating to the same path, just re-render (optional, depends on desired behavior)
                if (window.location.pathname === path) {
                    console.log("Router.js: Clicking on current path, re-rendering.");
                    this.navigateTo(path);
                    return;
                }

                history.pushState(null, '', path); // Update browser history
                this.navigateTo(path); // Navigate and render the new path
            }
        });

        // Perform initial routing when the page first loads
        this.navigateTo(this.currentPath);
    }
}
4. init()
Mục đích: Phương thức init() chịu trách nhiệm thiết lập các event listener cần thiết để router hoạt động. Nó được gọi một lần khi ứng dụng khởi động (thường là từ main.js).

Giải thích chi tiết:

Xử lý thay đổi lịch sử trình duyệt (popstate):

window.addEventListener('popstate', () => { this.navigateTo(window.location.pathname); });: Lắng nghe sự kiện popstate. Sự kiện này được kích hoạt khi người dùng nhấn nút quay lại hoặc tiến lên của trình duyệt, hoặc khi history.back(), history.forward(), history.go() được gọi. Khi đó, router sẽ gọi MapsTo() với đường dẫn URL hiện tại của trình duyệt để tải nội dung tương ứng.

Xử lý click vào các liên kết nội bộ:

document.body.addEventListener('click', (e) => { ... });: Lắng nghe sự kiện click trên toàn bộ document.body. Điều này sử dụng kỹ thuật event delegation, tức là chỉ cần một listener ở cấp cao nhất để bắt các click trên các liên kết.

const routeLink = e.target.closest('a[data-link]');: Tìm kiếm phần tử <a> gần nhất từ nơi click xảy ra, miễn là nó có thuộc tính data-link. Thuộc tính data-link là một quy ước để đánh dấu các liên kết mà router nên xử lý (thay vì tải lại toàn bộ trang).

if (routeLink) { ... }: Nếu tìm thấy một liên kết có data-link:

e.preventDefault();: Rất quan trọng! Ngăn chặn hành vi mặc định của trình duyệt khi click vào thẻ <a>, tức là ngăn chặn trình duyệt tải lại trang.

const path = routeLink.getAttribute('href');: Lấy đường dẫn từ thuộc tính href của liên kết.

if (window.location.pathname === path) { ... }: Kiểm tra xem người dùng có đang click vào liên kết trỏ đến cùng một đường dẫn hiện tại hay không. Nếu có, router có thể quyết định re-render lại trang (hành vi này là tùy chọn, có thể bỏ qua nếu không muốn re-render khi ở cùng path).

history.pushState(null, '', path);: Đây là một phần quan trọng khác của client-side routing. Nó thay đổi URL trong thanh địa chỉ của trình duyệt mà không tải lại trang. pushState thêm một entry mới vào lịch sử trình duyệt, cho phép người dùng sử dụng nút back/forward.

this.navigateTo(path);: Gọi phương thức MapsTo() để tải và render nội dung cho đường dẫn mới.

this.navigateTo(this.currentPath);: Thực hiện định tuyến ban đầu. Khi init() được gọi (tức là khi ứng dụng vừa tải xong), router sẽ điều hướng đến đường dẫn hiện tại của trình duyệt (this.currentPath đã được khởi tạo trong constructor) để tải nội dung phù hợp cho trang đầu tiên.

Tóm tắt ý nghĩa các hàm/phương thức:
constructor(routes): Khởi tạo router, lưu trữ danh sách các route và đối tượng sự kiện, đồng thời lấy đường dẫn hiện tại của trình duyệt.

async navigateTo(path):

Phần 1 (Khớp Route và Trích xuất Tham số): Duyệt qua các route đã định nghĩa, sử dụng biểu thức chính quy để khớp đường dẫn hiện tại với một route và trích xuất bất kỳ tham số nào có trong URL.

Phần 2 (Render Nội dung): Tải động file JavaScript của view component, tạo một thể hiện của component đó, gọi phương thức render() hoặc getHtml() của component để lấy nội dung HTML, và chèn nội dung đó vào phần tử content trên trang. Nó cũng gọi attachEvents() hoặc init() trên component sau khi render để gắn các sự kiện. Cuối cùng, nó phát ra sự kiện pathChanged.

init(): Thiết lập các lắng nghe sự kiện toàn cục:

Lắng nghe sự kiện popstate để xử lý các nút quay lại/tiến lên của trình duyệt.

Lắng nghe sự kiện click trên các liên kết có data-link để xử lý điều hướng nội bộ bằng JavaScript (ngăn chặn tải lại trang và cập nhật lịch sử trình duyệt).

Thực hiện điều hướng ban đầu khi trang được tải lần đầu.

Hy vọng giải thích này giúp bạn hiểu rõ hơn về cách hoạt động của Router này!