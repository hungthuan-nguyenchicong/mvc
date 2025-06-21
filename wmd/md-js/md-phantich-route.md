# phan tích

Chào bạn,

Đoạn mã JavaScript bạn cung cấp là một lớp Router được thiết kế để xây dựng một Single Page Application (SPA) sử dụng định tuyến dựa trên hash (dấu # trong URL) và tải động các module (dynamic imports). Đây là một cách tiếp cận hiện đại giúp tối ưu hóa hiệu suất bằng cách chỉ tải code cho trang hiện tại khi cần, thay vì tải toàn bộ ứng dụng cùng lúc.

Chúng ta hãy cùng đi sâu vào từng phần của lớp Router, từ cơ bản đến nâng cao nhé.

1. Cơ bản: Router Class và Constructor
JavaScript

/**
 * @class Router
 * @description Handles client-side hash-based routing for a Single Page Application,
 * supporting dynamic module loading for views.
 */
export class Router {
    /**
     * @param {HTMLElement} appElement - The DOM element where page content will be rendered.
     */
    constructor(appElement) {
        if (!appElement) {
            console.error('Router requires an app element to be provided');
            return; // Exit if critical element is missing
        }
        this.appElement = appElement;
        this.routes = []; // Array to store route definitions { path, pathRegex, viewPath, ViewClassName, name, paramNames }

        // Bind 'this' context for event listeners
        this.handleRouteBound = this.handleRoute.bind(this);

        // Define default route. NotFoundPage will be dynamically loaded.
        this.defaultRoute = 'home';

        // NOTE: We no longer instantiate NotFoundPage here.
        // We will store its path and class name, similar to other routes, for dynamic loading.
        this.notFoundViewPath = './views/notFound.js';
        this.notFoundViewClassName = 'NotFoundPage';
    }
    // ... các phương thức khác
}
Giải thích:
export class Router { ... }: Đây là cách định nghĩa một lớp JavaScript. Từ khóa export cho phép lớp này có thể được sử dụng (import) trong các file JavaScript khác.
constructor(appElement):
Đây là hàm khởi tạo của lớp Router. Nó sẽ được gọi ngay khi bạn tạo một đối tượng Router mới (ví dụ: new Router(document.getElementById('app'))).
Nó nhận vào một đối số là appElement, đây là một phần tử DOM (ví dụ: một div có id="app") nơi mà nội dung của các trang (views) sẽ được hiển thị.
Kiểm tra appElement: if (!appElement) { ... } là một kiểm tra an toàn. Nếu không có appElement, router sẽ không thể hiển thị nội dung, vì vậy nó in ra lỗi và dừng lại.
this.appElement = appElement;: Lưu trữ phần tử DOM này vào thuộc tính appElement của đối tượng Router để các phương thức khác có thể truy cập và cập nhật nó.
this.routes = [];: Khởi tạo một mảng rỗng để lưu trữ tất cả các định nghĩa tuyến đường (routes) của ứng dụng. Mỗi route sẽ là một đối tượng chứa thông tin về đường dẫn, regex, đường dẫn file view, tên lớp view, v.v.
this.handleRouteBound = this.handleRoute.bind(this);: Đây là một kỹ thuật quan trọng trong JavaScript để đảm bảo rằng khi hàm handleRoute được gọi làm một event listener (ví dụ: window.addEventListener('hashchange', this.handleRouteBound)), từ khóa this bên trong handleRoute vẫn sẽ trỏ đến đối tượng Router hiện tại, chứ không phải là window hoặc một đối tượng khác.
this.defaultRoute = 'home';: Định nghĩa tuyến đường mặc định. Nếu người dùng truy cập ứng dụng mà không có hash (ví dụ: yourdomain.com/), router sẽ tự động chuyển hướng đến #home.
this.notFoundViewPath = './views/notFound.js'; và this.notFoundViewClassName = 'NotFoundPage';: Lưu trữ đường dẫn và tên lớp của trang lỗi 404 (NotFoundPage). Thay vì tạo ngay một thể hiện của nó, chúng ta sẽ tải nó một cách động khi cần thiết, giống như các trang khác.
2. Thêm Tuyến Đường: addRoute()
JavaScript

    /**
     * Defines a new route for the application.
     * @param {string} path - The URL hash path (e.g., 'home', 'about', 'products/:id').
     * @param {string} viewPath - The path to the JavaScript file containing the view class (e.g., './views/home.js').
     * @param {string} ViewClassName - The name of the exported class within the viewPath file (e.g., 'HomePage').
     * @param {string} [name=null] - An optional name for the route.
     */
    addRoute(path, viewPath, ViewClassName, name = null) {
        // Chuyển đổi path thành Regular Expression để khớp với các tham số
        const pathRegex = new RegExp(
            '^' + path.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)') + '$'
        );

        // Trích xuất tên các tham số từ path
        const paramNames = (path.match(/:([a-zA-Z0-9_]+)/g) || []).map(param =>
            param.substring(1)
        );

        this.routes.push({
            path,
            pathRegex,
            viewPath,        // Lưu trữ đường dẫn module
            ViewClassName,   // Lưu trữ tên lớp để truy xuất từ module
            name,
            paramNames,
        });
        console.log(`Router: Added route "${path}" with dynamic view "${viewPath}" and class "${ViewClassName}".`);
    }
Giải thích:
addRoute(path, viewPath, ViewClassName, name = null): Phương thức này dùng để đăng ký một tuyến đường mới cho router.
path: Chuỗi đường dẫn hash mà bạn muốn khớp (ví dụ: 'home', 'about', 'products/:id'). Phần :id là một tham số động.
viewPath: Đường dẫn đến file JavaScript chứa lớp View (ví dụ: ./views/home.js).
ViewClassName: Tên của lớp View được export trong file viewPath (ví dụ: 'HomePage').
name: Một tên tùy chọn cho route này, hữu ích cho việc tham chiếu route sau này.
const pathRegex = new RegExp(...): Đây là phần nâng cao để xử lý các tham số động trong URL.
Nó tạo ra một biểu thức chính quy (Regular Expression - Regex) từ path cung cấp.
path.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)'): Dòng này tìm tất cả các phần tử bắt đầu bằng : (ví dụ :id) và thay thế chúng bằng ([^/]+).
: khớp với ký tự hai chấm.
([a-zA-Z0-9_]+) khớp với một hoặc nhiều ký tự chữ cái, số, hoặc gạch dưới (tên tham số). Phần trong ngoặc () tạo thành một nhóm bắt giữ (capturing group).
g là cờ "global", đảm bảo thay thế tất cả các lần xuất hiện.
([^/]+): Đây là phần thay thế.
[^/] khớp với bất kỳ ký tự nào KHÔNG phải là dấu /.
+ khớp với một hoặc nhiều lần.
Kết quả là, ([^/]+) sẽ khớp với giá trị thực tế của tham số trong URL (ví dụ: 123 cho :id) và nó cũng là một nhóm bắt giữ.
'^' + ... + '$': Thêm dấu ^ (bắt đầu chuỗi) và $ (kết thúc chuỗi) để đảm bảo toàn bộ hash khớp chính xác với regex, không chỉ một phần.
const paramNames = (path.match(/:([a-zA-Z0-9_]+)/g) || []).map(...): Dòng này trích xuất tên của các tham số (ví dụ: id từ :id) để sau này chúng ta có thể ánh xạ các giá trị từ URL vào đúng tên tham số.
path.match(/:([a-zA-Z0-9_]+)/g): Tìm tất cả các tham số có dạng :name. Nó trả về một mảng các chuỗi như [':id', ':category'] hoặc null nếu không có.
|| []: Nếu match trả về null, nó sẽ sử dụng một mảng rỗng để tránh lỗi.
.map(param => param.substring(1)): Duyệt qua mảng các tham số tìm được và xóa ký tự : ở đầu (ví dụ: biến :id thành id).
this.routes.push(...): Lưu trữ một đối tượng chứa tất cả thông tin này vào mảng this.routes.
3. Khởi tạo Router: init()
JavaScript

    /**
     * Initializes the router by setting up event listeners.
     */
    init() {
        window.addEventListener('hashchange', this.handleRouteBound);
        window.addEventListener('DOMContentLoaded', () => {
            console.log('Router: DOMContentLoaded fired. Calling handleRoute for initial load.');
            this.handleRoute(); // Handle the route on initial page load
        });
    }
Giải thích:
init(): Phương thức này khởi động router bằng cách thiết lập các trình lắng nghe sự kiện.
window.addEventListener('hashchange', this.handleRouteBound);: Lắng nghe sự kiện hashchange. Bất cứ khi nào phần hash của URL thay đổi (ví dụ: từ #home sang #about), sự kiện này sẽ kích hoạt và gọi hàm this.handleRouteBound. Nhớ rằng this.handleRouteBound đã được bind(this) trong constructor.
window.addEventListener('DOMContentLoaded', () => { ... });: Lắng nghe sự kiện DOMContentLoaded. Sự kiện này kích hoạt khi toàn bộ tài liệu HTML đã được tải và phân tích cú pháp hoàn chỉnh (nhưng hình ảnh và các tài nguyên khác có thể chưa tải xong).
Trong callback của sự kiện này, this.handleRoute() được gọi để xử lý tuyến đường ban đầu khi trang web vừa tải lần đầu tiên. Điều này đảm bảo rằng nội dung phù hợp được hiển thị ngay cả khi người dùng truy cập trực tiếp một URL có hash (ví dụ: yourdomain.com/#about).
4. Điều hướng: Maps()
JavaScript

    /**
     * Programmatically navigates to a new route.
     * @param {string} path - The hash path to navigate to.
     * @param {boolean} [replace=false] - If true, replaces the current history entry.
     */
    navigate(path, replace = false) {
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }
        console.log(`Router: Navigating to #${path} (replace: ${replace}).`);
    }
Giải thích:
Maps(path, replace = false): Phương thức này cho phép bạn điều hướng đến một tuyến đường mới bằng mã JavaScript.
path: Chuỗi hash mà bạn muốn chuyển đến (ví dụ: 'home', 'products/123').
replace: Một cờ boolean tùy chọn.
Nếu true, nó sẽ thay thế mục nhập hiện tại trong lịch sử duyệt web bằng tuyến đường mới. Điều này có nghĩa là khi người dùng nhấn nút "Back" của trình duyệt, họ sẽ không quay lại trang trước đó trước khi điều hướng.
Nếu false (mặc định), nó sẽ thêm tuyến đường mới vào lịch sử duyệt web, cho phép người dùng quay lại.
window.location.replace(#${path});: Sử dụng replace() để thay thế mục nhập lịch sử.
window.location.hash = path;: Gán giá trị mới cho phần hash của URL. Việc này sẽ tự động kích hoạt sự kiện hashchange và do đó, handleRoute() sẽ được gọi để tải nội dung trang mới.
5. Hiển thị Trạng thái tải: showLoadingSpinner()
JavaScript

    /**
     * Displays a loading spinner while content is being fetched.
     */
    showLoadingSpinner() {
        if (this.appElement) {
            this.appElement.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                    <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full rounded-xl">
                        <h1 class="text-3xl font-bold text-gray-800 mb-4">Đang tải nội dung...</h1>
                        <div class="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin { animation: spin 1s linear infinite; }
                </style>
            `;
        }
    }
Giải thích:
showLoadingSpinner(): Phương thức này đơn giản là cập nhật innerHTML của appElement để hiển thị một thông báo "Đang tải nội dung..." cùng với một biểu tượng spinner CSS đơn giản.
Nó được gọi trước khi quá trình tải động (dynamic import) bắt đầu trong handleRoute() để cung cấp phản hồi trực quan cho người dùng rằng nội dung đang được tải.
Đoạn CSS style được nhúng trực tiếp vào HTML. Đây là một cách nhanh chóng để thêm kiểu cho spinner mà không cần một file CSS riêng.
6. Xử lý Tuyến Đường Chính: handleRoute() (Nâng cao)
JavaScript

    /**
     * Handles the current URL hash, dynamically loads the view, and renders it.
     * This method is now asynchronous due to the use of 'await import()'.
     */
    async handleRoute() { // IMPORTANT: This method must be async
        const currentHashFromUrl = window.location.hash.substring(1);
        const hash = currentHashFromUrl || this.defaultRoute;
        console.log(`handleRoute: Processing hash: "${currentHashFromUrl || '[empty]'}" -> effective hash for routing: "${hash}"`);

        let content = '';
        let matchedRoute = null;
        let routeParams = {};

        for (const route of this.routes) {
            console.log(`handleRoute: Trying to match "${hash}" against route path "${route.path}" (Regex: ${route.pathRegex})`);
            const match = hash.match(route.pathRegex);
            if (match) {
                matchedRoute = route;
                console.log(`handleRoute: Matched route: "${matchedRoute.path}"`);
                // Ánh xạ các giá trị bắt được từ regex vào tên tham số
                route.paramNames.forEach((name, index) => {
                    routeParams[name] = match[index + 1]; // match[0] là toàn bộ chuỗi khớp, các index tiếp theo là nhóm bắt giữ
                });
                console.log('handleRoute: Extracted route parameters:', routeParams);
                break; // Tìm thấy route, dừng vòng lặp
            }
        }

        if (this.appElement) {
            this.showLoadingSpinner(); // Hiển thị spinner trong khi tải
        }

        if (matchedRoute) {
            try {
                console.log(`handleRoute: Dynamically importing view from "${matchedRoute.viewPath}"`);
                // Dynamic Import: Tải module JS chỉ khi cần
                const viewModule = await import(matchedRoute.viewPath);
                // Lấy lớp View từ module đã tải
                const ViewClass = viewModule[matchedRoute.ViewClassName];

                if (ViewClass) {
                    console.log(`handleRoute: Instantiating ViewClass "${matchedRoute.ViewClassName}" for "${matchedRoute.path}"`);
                    // Tạo một thể hiện của lớp View và truyền các tham số
                    const page = new ViewClass(routeParams);
                    // Gọi phương thức render() của View để lấy nội dung HTML
                    content = page.render();
                    console.log(`handleRoute: View for "${matchedRoute.path}" rendered successfully.`);
                } else {
                    console.error(`handleRoute: Class "${matchedRoute.ViewClassName}" not found in module "${matchedRoute.viewPath}". Falling back to 404.`);
                    // Fallback to 404 if class not found in module
                    content = await this.renderNotFoundPage();
                }

            } catch (error) {
                console.error(`handleRoute: Error loading or rendering view for route "${hash}":`, error);
                // Fallback to 404 page in case of a general loading/rendering error
                content = await this.renderNotFoundPage(error); // Truyền lỗi để trang 404 có thể hiển thị chi tiết hơn
            }
        } else {
            console.log(`handleRoute: No route matched for "${hash}". Rendering 404 page.`);
            // Không tìm thấy route nào khớp, tải và hiển thị trang 404 động
            content = await this.renderNotFoundPage();
        }

        // Cập nhật nội dung vào phần tử ứng dụng
        if (this.appElement) {
            this.appElement.innerHTML = content;
        } else {
            console.error('handleRoute: App element is not defined, cannot render content.');
        }
    }
Giải thích:
async handleRoute(): Đây là trái tim của router. Nó được đánh dấu async vì nó sẽ sử dụng await import(), một hoạt động bất đồng bộ.
Xác định Hash hiện tại:
const currentHashFromUrl = window.location.hash.substring(1);: Lấy phần hash từ URL (ví dụ: #about sẽ lấy 'about') và loại bỏ ký tự # đầu tiên.
const hash = currentHashFromUrl || this.defaultRoute;: Nếu không có hash trong URL (người dùng truy cập trang chủ), sử dụng this.defaultRoute (mặc định là 'home').
Tìm kiếm tuyến đường khớp:
Vòng lặp for (const route of this.routes): Duyệt qua tất cả các tuyến đường đã đăng ký.
const match = hash.match(route.pathRegex);: Cố gắng khớp hash hiện tại với pathRegex của từng tuyến đường.
if (match): Nếu tìm thấy một sự khớp:
matchedRoute = route;: Gán tuyến đường khớp.
Trích xuất tham số (routeParams): route.paramNames.forEach((name, index) => { routeParams[name] = match[index + 1]; });
match là một mảng kết quả từ regex. match[0] là toàn bộ chuỗi khớp.
Các nhóm bắt giữ (như ([^/]+)) sẽ nằm ở match[1], match[2], v.v.
Vòng lặp này ánh xạ các giá trị này vào một đối tượng routeParams dựa trên tên tham số đã trích xuất (ví dụ: { id: '123' }).
break;: Dừng vòng lặp ngay khi tìm thấy tuyến đường khớp đầu tiên.
Hiển thị Spinner: this.showLoadingSpinner(); được gọi ngay sau khi xác định được hash, để người dùng biết rằng nội dung mới đang được tải.
Tải động và Render View:
if (matchedRoute): Nếu có một tuyến đường khớp:
try...catch: Bao bọc toàn bộ quá trình tải và render trong một khối try...catch để xử lý lỗi một cách duyên dáng.
const viewModule = await import(matchedRoute.viewPath);: Đây là điểm mấu chốt của tải động. Hàm import() động này tải file JavaScript của View chỉ khi nó được yêu cầu. Nó trả về một Promise, vì vậy chúng ta dùng await để đợi module được tải.
const ViewClass = viewModule[matchedRoute.ViewClassName];: Sau khi module được tải, nó trả về một đối tượng module. Các export được đặt tên (named exports) sẽ là các thuộc tính của đối tượng này. Chúng ta truy cập lớp View bằng tên đã lưu trữ (ViewClassName).
if (ViewClass): Kiểm tra xem lớp View có tồn tại trong module không.
const page = new ViewClass(routeParams);: Tạo một thể hiện mới của lớp View, truyền routeParams vào constructor của View (để View có thể sử dụng các tham số như ID sản phẩm).
content = page.render();: Gọi phương thức render() của đối tượng View để lấy nội dung HTML của trang. Giả định rằng mỗi View class sẽ có một phương thức render() trả về một chuỗi HTML.
else { ... Fallback to 404 ... }: Nếu lớp View không tìm thấy trong module (ví dụ: lỗi đánh máy tên lớp), hiển thị trang 404.
Xử lý lỗi: catch (error) sẽ bắt các lỗi xảy ra trong quá trình import() (ví dụ: file không tồn tại) hoặc trong quá trình khởi tạo/render của View. Trong trường hợp lỗi, nó cũng sẽ hiển thị trang 404.
else { ... Render 404 page ... }: Nếu không tìm thấy tuyến đường nào khớp với hash hiện tại, trực tiếp gọi renderNotFoundPage().
Hiển thị nội dung: this.appElement.innerHTML = content;: Sau khi nội dung được tạo hoặc tải, nó được chèn vào appElement, thay thế spinner hoặc nội dung cũ.
7. Hiển thị Trang 404: renderNotFoundPage() (Nâng cao)
JavaScript

    /**
     * Dynamically loads and renders the NotFoundPage.
     * @param {Error} [originalError] - Optional original error object for debugging.
     * @returns {Promise<string>} The HTML content of the 404 page.
     */
    async renderNotFoundPage(originalError = null) {
        try {
            console.log(`renderNotFoundPage: Dynamically importing NotFoundPage from "${this.notFoundViewPath}"`);
            const notFoundModule = await import(this.notFoundViewPath);
            const NotFoundClass = notFoundModule[this.notFoundViewClassName];

            if (NotFoundClass) {
                console.log('renderNotFoundPage: Instantiating NotFoundPage.');
                const notFoundPage = new NotFoundClass();
                return notFoundPage.render();
            } else {
                console.error(`renderNotFoundPage: Class "${this.notFoundViewClassName}" not found in module "${this.notFoundViewPath}".`);
                // Fallback HTML nếu không tải được trang NotFoundPage
                return `
                    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                        <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full rounded-xl">
                            <h1 class="text-4xl font-bold text-red-600 mb-4">Lỗi nội bộ</h1>
                            <p class="text-gray-600 mb-4">Không thể tải trang 404.</p>
                            <a href="#home" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md">
                                Về trang chủ
                            </a>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('renderNotFoundPage: Failed to dynamically load NotFoundPage:', error, 'Original error:', originalError);
            // HTML lỗi nghiêm trọng nếu thậm chí trang NotFoundPage cũng không tải được
            return `
                <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                    <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full rounded-xl">
                        <h1 class="text-4xl font-bold text-red-600 mb-4">Lỗi nghiêm trọng</h1>
                        <p class="text-gray-600 mb-4">Không thể tải trang lỗi. Vui lòng thử lại sau.</p>
                        <a href="#home" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md">
                            Về trang chủ
                        </a>
                    </div>
                </div>
            `;
        }
    }
Giải thích:
async renderNotFoundPage(originalError = null): Phương thức này được dùng để xử lý trường hợp không tìm thấy tuyến đường hoặc xảy ra lỗi khi tải/render một View nào đó. Nó cũng là async vì sử dụng await import().
Tải động NotFoundPage: Tương tự như handleRoute(), nó cố gắng tải module của NotFoundPage bằng await import(this.notFoundViewPath).
Kiểm tra và Render: Nếu NotFoundClass được tìm thấy trong module, nó sẽ tạo một thể hiện và gọi render() để lấy HTML.
Xử lý lỗi nhiều cấp:
Cấp 1: Nếu NotFoundClass không được tìm thấy trong module (ví dụ: tên lớp sai), nó sẽ trả về một chuỗi HTML đơn giản cho "Lỗi nội bộ" (không thể tải trang 404).
Cấp 2: Khối catch bên ngoài sẽ bắt bất kỳ lỗi nào xảy ra trong quá trình import() của NotFoundPage (ví dụ: file notFound.js không tồn tại hoặc có lỗi cú pháp). Trong trường hợp này, nó trả về một chuỗi HTML "Lỗi nghiêm trọng" (không thể tải trang lỗi). Điều này giúp đảm bảo người dùng luôn thấy một cái gì đó, ngay cả khi mọi thứ đều thất bại.
originalError được truyền vào cho phép bạn (dưới tư cách nhà phát triển) có thêm thông tin gỡ lỗi về nguyên nhân gốc rễ của lỗi, mặc dù không được hiển thị cho người dùng cuối.
Tóm tắt luồng hoạt động của Router:
Khởi tạo: Bạn tạo một thể hiện của Router và truyền vào phần tử DOM chính của ứng dụng.
Định nghĩa Route: Bạn sử dụng addRoute() để khai báo tất cả các tuyến đường mà ứng dụng của bạn sẽ hỗ trợ, bao gồm đường dẫn, file View và tên lớp View.
Khởi động: Gọi router.init(). Điều này thiết lập các trình lắng nghe sự kiện:
DOMContentLoaded: Router xử lý tuyến đường ban đầu khi trang web tải xong.
hashchange: Router xử lý mọi thay đổi hash trong URL do người dùng hoặc code gây ra.
Xử lý Route (handleRoute):
Xác định hash hiện tại từ URL.
Tìm kiếm một tuyến đường khớp trong danh sách this.routes bằng cách sử dụng Regex. Nếu có tham số động, chúng sẽ được trích xuất.
Hiển thị spinner tải.
Tải động module View: Sử dụng await import() để tải file JavaScript của View chỉ khi tuyến đường đó được khớp.
Khởi tạo và Render View: Sau khi module được tải, router tạo một thể hiện của lớp View được chỉ định và gọi phương thức render() của nó để lấy HTML.
Cập nhật DOM: Chèn HTML đã render vào phần tử ứng dụng chính (this.appElement).
Xử lý lỗi/404: Nếu không tìm thấy tuyến đường, hoặc có lỗi trong quá trình tải/render View, router sẽ tải và hiển thị trang 404 động (hoặc một thông báo lỗi fallback).
Điều hướng (Maps): Bạn có thể gọi router.navigate('some-path') để chuyển hướng người dùng đến một tuyến đường mới bằng mã, điều này cũng sẽ kích hoạt handleRoute().
Router này là một ví dụ tuyệt vời về cách xây dựng một SPA cơ bản với hiệu suất tốt hơn nhờ vào kỹ thuật tải động module.

Bạn có muốn đi sâu vào cách tạo các lớp View (ví dụ: HomePage, AboutPage) để hoạt động với Router này không?