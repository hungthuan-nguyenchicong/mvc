## document.dispatchEvent(routeChangeEvent);

Tách Biệt Logic với Custom Events
Chúng ta sẽ tạo một sự kiện tùy chỉnh (Custom Event). Khi window.location.pathname thay đổi (do click hoặc popstate), một sự kiện sẽ được phát ra. Các thành phần khác như navigation (hoặc sidebar sau này) sẽ lắng nghe sự kiện này và chỉ thực hiện việc cập nhật class active.

Ưu điểm của phương pháp này:
Tách biệt rõ ràng: Module routing chỉ lo về việc thay đổi URL và thông báo. Module UI (nav, sidebar) chỉ lo về việc cập nhật giao diện khi nhận được thông báo.

Dễ mở rộng: Nếu sau này bạn có thêm các thành phần UI khác cần phản ứng với sự thay đổi của route (ví dụ: breadcrumbs, tiêu đề trang), chúng chỉ cần lắng nghe cùng một sự kiện.

Dễ kiểm thử: Mỗi module có thể được kiểm thử độc lập.

Cập Nhật Codemain.js
Dưới đây là cách bạn có thể cấu trúc lại code:

JavaScript

import './main.scss';
import './hoc-vi-du-co-ban/main.scss';
import './hoc-vi-du-co-ban/nav.scss';

// --- Khởi tạo các phần tử DOM cơ bản ---
const app = document.getElementById('app');

const navElement = document.createElement('nav');
app.appendChild(navElement);
navElement.innerHTML = /* html */ `
    <ul>
        <li><a href="/" data-path="/">Home</a></li>
        <li><a href="/about" data-path="/about">About</a></li>
        <li><a href="/contact" data-path="/contact">Contact</a></li>
        <li><a href="/test" data-path="/test">Test 404</a></li>
    </ul>
`;

const mainContent = document.createElement('main');
app.appendChild(mainContent);

// --- Cấu hình Routes ---
const routes = {
    '/': {
        content: '<h1>Home</h1>',
        title: 'Trang chủ'
    },
    '/about': {
        content: '<h1>About</h1>',
        title: 'Về chúng tôi'
    },
    '/contact': {
        content: '<h1>Contact</h1>',
        title: 'Liên hệ'
    },
    '/404': {
        content: '<h1>Trang 404</h1>',
        title: '404 - Không tìm thấy'
    }
};

// --- Các hàm xử lý UI ---

/**
 * Renders content and updates document title based on the given path.
 * Falls back to 404 if route not found.
 * @param {string} path - The URL path to render.
 */
const renderContent = (path) => {
    const page = routes[path] || routes['/404'];
    mainContent.innerHTML = page.content;
    document.title = page.title || 'Ứng dụng SPA của tôi';
};

/**
 * Lắng nghe sự kiện 'routeChange' và cập nhật class 'active' cho các liên kết.
 * Đây là phần UI 'nhận sự kiện'.
 */
const setupNavActiveLinkListener = () => {
    // Chúng ta lắng nghe sự kiện trên 'document' để bao quát toàn bộ ứng dụng
    document.addEventListener('routeChange', (event) => {
        const { path } = event.detail; // Lấy path từ dữ liệu sự kiện

        document.querySelectorAll('a[data-path]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-path') === path) {
                link.classList.add('active');
            }
        });
    });
};

// --- Logic Router (Phát ra sự kiện) ---

/**
 * The central routing function that determines the current URL,
 * handles 404, renders content, and DISPATCHES the 'routeChange' event.
 */
const router = () => {
    let currentPath = window.location.pathname;

    // Handle 404 route: if the current path isn't in our routes, redirect to /404
    if (!routes[currentPath]) {
        window.history.replaceState({}, '', '/404');
        currentPath = '/404'; // Use /404 path for rendering and event dispatch
    }

    renderContent(currentPath); // Render the main content (vẫn nằm ở đây vì nó là phần cốt lõi của route)

    // *** Đây là điểm phát ra sự kiện ***
    // Tạo một sự kiện tùy chỉnh với chi tiết là đường dẫn hiện tại
    const routeChangeEvent = new CustomEvent('routeChange', {
        detail: { path: currentPath }
    });
    // Phát sự kiện trên 'document' để các thành phần khác có thể lắng nghe
    document.dispatchEvent(routeChangeEvent);
};

// --- Thiết lập Event Listeners và Khởi tạo ---

// 1. Xử lý click trực tiếp vào các liên kết điều hướng
document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('a[data-path]');
    if (targetLink) {
        e.preventDefault();
        const path = targetLink.getAttribute('data-path');

        // Chỉ push state nếu path khác để tránh các entry trùng lặp trong lịch sử
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }
        router(); // Kích hoạt router để xử lý và phát sự kiện
    }
});

// 2. Xử lý nút quay lại/tiến lên của trình duyệt (popstate event)
window.addEventListener('popstate', () => {
    router(); // Kích hoạt router để xử lý và phát sự kiện
});

// 3. Khởi tạo trang khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    router(); // Kích hoạt router để xử lý URL ban đầu
    setupNavActiveLinkListener(); // Thiết lập lắng nghe sự kiện cho nav
});
Giải thích các Thay đổi Chính:
CustomEvent('routeChange', { detail: { path: currentPath } }):

Chúng ta tạo một sự kiện mới có tên là 'routeChange'.

detail là một thuộc tính quan trọng cho phép bạn đính kèm dữ liệu vào sự kiện. Ở đây, chúng ta truyền path hiện tại.

Sự kiện này được phát ra trên document bằng document.dispatchEvent().

router()chức năng :

Giờ đây, router() không còn trực tiếp gọi setActiveLink(). Thay vào đó, nó sẽ phát ra (dispatch) sự kiện routeChange sau khi renderContent đã chạy.

Điều này có nghĩa là trách nhiệm của router là thay đổi URL, hiển thị nội dung, và thông báo rằng một route đã thay đổi.

setupNavActiveLinkListener()chức năng :

Đây là hàm mới có trách nhiệm lắng nghe (listen) sự kiện routeChange.

Khi sự kiện được phát ra, nó sẽ nhận được path thông qua event.detail và sau đó thực hiện đúng công việc của nó: cập nhật class active cho các liên kết điều hướng.

Hàm này chỉ cần được gọi một lần khi ứng dụng khởi tạo (trong DOMContentLoaded) để thiết lập lắng nghe.

Cập nhật DOMContentLoaded:

Trong DOMContentLoaded, chúng ta gọi router() để xử lý URL ban đầu của trang.

Đồng thời, chúng ta cũng gọi setupNavActiveLinkListener() để đảm bảo navigation của bạn sẵn sàng lắng nghe các thay đổi route ngay từ đầu.

Cách mở rộng cho Sidebar:
Nếu sau này bạn có một sidebar cũng cần highlight item active, bạn chỉ cần tạo một hàm tương tự setupNavActiveLinkListener:

JavaScript

const setupSidebarActiveLinkListener = () => {
    document.addEventListener('routeChange', (event) => {
        const { path } = event.detail;
        // Logic để tìm và cập nhật class 'active' cho các liên kết trong sidebar
        // Ví dụ: document.querySelectorAll('.sidebar-link').forEach(...)
    });
};

// Trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    router();
    setupNavActiveLinkListener();
    setupSidebarActiveLinkListener(); // Thêm listener cho sidebar
});
Bằng cách này, bạn đã đạt được sự tách biệt mà bạn mong muốn, giúp code của bạn dễ quản lý và mở rộng hơn rất nhiều!

## tham khảo ví dụ 

Bạn đang đi đúng hướng với việc sử dụng dispatchEvent() để tách biệt các phần của ứng dụng! dispatchEvent() là một phương thức cực kỳ quan trọng trong JavaScript để tạo và quản lý sự kiện tùy chỉnh (Custom Events), cho phép các thành phần khác nhau của ứng dụng giao tiếp mà không cần biết trực tiếp về nhau.

dispatchEvent(): Phát Ra Tín Hiệu
dispatchEvent() là phương thức của đối tượng EventTarget (mà document, window, và tất cả các phần tử HTML đều kế thừa). Chức năng chính của nó là kích hoạt hoặc "phát ra" một sự kiện đã được tạo.

Hãy hình dung nó giống như một người đưa thư đang giao một bức thư hoặc một đài phát thanh đang phát sóng một tín hiệu. Ai quan tâm đến bức thư/tín hiệu đó có thể "lắng nghe" và phản hồi.

Cú pháp cơ bản
JavaScript

someEventTarget.dispatchEvent(event);
someEventTarget: Đây là đối tượng mà bạn muốn phát sự kiện từ đó. Có thể là document, window, hoặc một phần tử DOM cụ thể (ví dụ: buttonElement).

event: Đây là một đối tượng sự kiện mà bạn đã tạo (ví dụ: new Event(), new CustomEvent(), new MouseEvent(), v.v.).

Ví dụ về dispatchEvent() trong ngữ cảnh của bạn
Trong đoạn code SPA của bạn:

JavaScript

const routeChangeEvent = new CustomEvent('routeChange', {
    detail: { path: currentPath }
});
document.dispatchEvent(routeChangeEvent);
new CustomEvent('routeChange', { detail: { path: currentPath } }): Dòng này tạo ra một sự kiện tùy chỉnh mới.

'routeChange': Tên của sự kiện. Bạn tự định nghĩa tên này.

{ detail: { path: currentPath } }: Đây là một đối tượng cấu hình tùy chọn. detail là một thuộc tính đặc biệt trong CustomEvent cho phép bạn đính kèm bất kỳ dữ liệu nào bạn muốn. Trong trường hợp này, bạn đang gửi đường dẫn (path) của route đã thay đổi.

document.dispatchEvent(routeChangeEvent);: Dòng này "phát" sự kiện routeChangeEvent trên đối tượng document. Điều này có nghĩa là bất kỳ đoạn code nào đang "lắng nghe" sự kiện 'routeChange' trên document sẽ được kích hoạt.

Tại sao lại phát trên document?
Phát sự kiện trên document là một lựa chọn phổ biến cho các sự kiện cấp độ ứng dụng hoặc toàn cục, bởi vì:

documentlà một đối tượng gốc mà hầu hết các thành phần đều có thể truy cập dễ dàng.

Nó đảm bảo rằng tất cả các thành phần, dù chúng nằm ở đâu trong cây DOM, đều có thể lắng nghe sự kiện này nếu chúng muốn.

Nó tạo ra một kênh giao tiếp toàn cầu cho các thông báo quan trọng của ứng dụng.

Ví Dụ Cơ Bản VềdispatchEvent()
Hãy xem một vài ví dụ đơn giản hơn để hiểu rõ hơn cách dispatchEvent() hoạt động.

Ví dụ 1: Nút "Tôi Đã Click!"
Hãy tưởng tượng bạn có một nút và khi bạn click vào nó, bạn muốn một phần tử khác thông báo "Nút đã được click!" mà không cần trực tiếp thao tác với phần tử đó.

HTML:

HTML

<button id="myButton">Click me!</button>
<div id="messageBox"></div>
JavaScript:

JavaScript

const myButton = document.getElementById('myButton');
const messageBox = document.getElementById('messageBox');

// 1. Lắng nghe sự kiện click thông thường trên nút
myButton.addEventListener('click', () => {
    console.log('Nút được click!');

    // 2. Tạo một sự kiện tùy chỉnh
    const buttonClickedEvent = new CustomEvent('buttonWasClicked', {
        detail: {
            timestamp: new Date().toLocaleTimeString(),
            message: 'Thông báo từ Custom Event!'
        }
    });

    // 3. Phát sự kiện tùy chỉnh này trên chính nút đó
    myButton.dispatchEvent(buttonClickedEvent);
});

// 4. Một phần tử khác lắng nghe sự kiện tùy chỉnh trên nút
myButton.addEventListener('buttonWasClicked', (event) => {
    console.log('Sự kiện tùy chỉnh "buttonWasClicked" đã được lắng nghe!');
    console.log('Dữ liệu đính kèm:', event.detail);
    messageBox.textContent = `Nút đã được click lúc ${event.detail.timestamp}. ${event.detail.message}`;
});

// Bạn cũng có thể lắng nghe trên document nếu muốn một sự kiện toàn cục hơn
document.addEventListener('buttonWasClicked', (event) => {
    console.log('Sự kiện tùy chỉnh "buttonWasClicked" được lắng nghe bởi document!');
});
Giải thích:

Khi bạn click vào myButton, myButton.addEventListener('click', ...) sẽ chạy.

Bên trong hàm xử lý click, chúng ta tạo một CustomEvent tên là buttonWasClicked và đính kèm dữ liệu vào detail.

Sau đó, myButton.dispatchEvent(buttonClickedEvent) sẽ "phát" sự kiện này từ myButton.

Bất kỳ addEventListener nào lắng nghe buttonWasClicked trên myButton (hoặc document nếu sự kiện được phát ra trên document) sẽ nhận và xử lý sự kiện đó.

Ví dụ 2: Thay Đổi Chủ Đề (Theme Change)
Giả sử bạn có một nút chuyển đổi chế độ sáng/tối và bạn muốn nhiều thành phần UI khác nhau (navbar, footer, main content) phản ứng với sự thay đổi này.

HTML:

HTML

<button id="themeToggle">Toggle Theme</button>
<div id="header" class="light-theme">Header</div>
<div id="content" class="light-theme">Content Area</div>
<div id="footer" class="light-theme">Footer</div>
JavaScript:

JavaScript

const themeToggleBtn = document.getElementById('themeToggle');
const header = document.getElementById('header');
const content = document.getElementById('content');
const footer = document.getElementById('footer');

let currentTheme = 'light';

themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    console.log(`Chủ đề đổi sang: ${currentTheme}`);

    // Phát sự kiện tùy chỉnh 'themeChanged' trên document
    const themeChangedEvent = new CustomEvent('themeChanged', {
        detail: { newTheme: currentTheme }
    });
    document.dispatchEvent(themeChangedEvent);
});

// Các thành phần UI lắng nghe sự kiện 'themeChanged'
document.addEventListener('themeChanged', (event) => {
    const { newTheme } = event.detail;
    console.log(`Nhận được sự kiện themeChanged. Chủ đề mới: ${newTheme}`);

    // Header phản ứng
    header.classList.remove('light-theme', 'dark-theme');
    header.classList.add(`${newTheme}-theme`);

    // Content phản ứng
    content.classList.remove('light-theme', 'dark-theme');
    content.classList.add(`${newTheme}-theme`);

    // Footer phản ứng
    footer.classList.remove('light-theme', 'dark-theme');
    footer.classList.add(`${newTheme}-theme`);
});
Giải thích:

Khi themeToggleBtn được click, nó cập nhật currentTheme và sau đó dispatchEvent() một sự kiện themeChanged trên document, mang theo newTheme trong detail.

Một duy nhất addEventListener trên document lắng nghe sự kiện này. Khi nhận được, nó truy cập event.detail.newTheme và sau đó cập nhật class cho tất cả các phần tử UI liên quan.

Tóm tắt ý nghĩa của dispatchEvent() trong SPA của bạn
Trong ứng dụng SPA của bạn, dispatchEvent() cho phép:

Module Routing (hàm router) chỉ tập trung vào việc quản lý URL và nội dung chính. Khi URL thay đổi, nó sẽ phát đi tín hiệu ("route đã thay đổi, đây là đường dẫn mới!").

Module Navigation (hàm setupNavActiveLinkListener) chỉ tập trung vào việc lắng nghe tín hiệu đó. Khi nhận được tín hiệu, nó sẽ biết "À, đường dẫn mới là X, vậy mình cần cập nhật class active cho liên kết X."

Điều này giúp mã của bạn có tổ chức hơn, dễ bảo trì và mở rộng hơn rất nhiều!

### dọc thêm

Đó là một câu hỏi tuyệt vời về cú pháp JavaScript và nó chỉ ra một tính năng rất hữu ích được gọi là phân tách đối tượng .

Giải thích về Object Destructuring
Dòng này const { newTheme } = event.detail;sử dụng phép gán hủy cấu trúc đối tượng . Đây là cách viết tắt để trích xuất các thuộc tính từ một đối tượng và gán chúng cho các biến có cùng tên.

Chúng ta hãy phân tích nó nhé:

event.detail: Trong CustomEvent, bạn đã truyền một đối tượng như là detail:

JavaScript

new CustomEvent('themeChanged', {
    detail: { newTheme: currentTheme } // <--- This is event.detail
});
Vậy, event.detailmột vật thể trông như thế này: { newTheme: 'light' }hoặc { newTheme: 'dark' }.

{ newTheme } = event.detail:Cú pháp này cho JavaScript biết: "Hãy xem event.detailđối tượng. Tìm một thuộc tính có tên newThemetrong đó. Lấy giá trị của thuộc tính đó và gán nó cho một biến hằng số mới cũng có tên là newTheme."

Tại sao nên sử dụng Destructuring?
Bạn hỏi tại sao không const newTheme = event.detail.newTheme;. Cả hai dòng đều đạt được kết quả giống hệt nhau trong trường hợp cụ thể này: cả hai đều tạo ra một biến hằng số newThemevà gán cho nó giá trị là event.detail.newTheme.

Tuy nhiên, việc phân rã đối tượng mang lại một số lợi thế, đặc biệt khi xử lý các đối tượng có nhiều thuộc tính:

Khả năng đọc: Giúp bạn ngay lập tức biết được thuộc tính nào bạn đang trích xuất từ ​​một đối tượng.

Tính súc tích: Thường ngắn hơn và giảm sự lặp lại, đặc biệt là khi trích xuất nhiều thuộc tính.

Trích xuất nhiều thuộc tính: Đây là nơi nó thực sự tỏa sáng. Hãy tưởng tượng event.detailcó nhiều thuộc tính hơn:

JavaScript

// If event.detail was: { newTheme: 'dark', user: 'Alice', timestamp: '10:00 AM' }

// Using traditional dot notation:
const newTheme = event.detail.newTheme;
const user = event.detail.user;
const timestamp = event.detail.timestamp;

// Using object destructuring:
const { newTheme, user, timestamp } = event.detail; // Much cleaner!
Giá trị mặc định: Bạn có thể gán giá trị mặc định nếu một thuộc tính nào đó bị thiếu:

JavaScript

const { newTheme = 'default-light' } = event.detail;
Đổi tên các thuộc tính được trích xuất: Bạn có thể trích xuất một thuộc tính và đặt cho nó một tên biến khác:

JavaScript

const { newTheme: themeValue } = event.detail; // Now you'd use 'themeValue'
console.log(themeValue);
Trong trường hợp cụ thể của bạn
Mặc dù const newTheme = event.detail.newTheme;hoạt động hoàn hảo cho event.detailđối tượng đơn giản của bạn, const { newTheme } = event.detail;nhưng là một cách diễn đạt JavaScript hiện đại hơn. Nó chuẩn bị mã của bạn để mở rộng dễ dàng hơn nếu event.detailcần mang thêm thông tin và thường được coi là cách thực hành tốt vì tính rõ ràng và súc tích của nó.

Tóm lại, const { newTheme } = event.detail;đây là cách thanh lịch và linh hoạt hơn để newThemesử event.detaildụng phương pháp phân rã đối tượng!