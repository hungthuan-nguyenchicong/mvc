## học state cơ bản

Chắc chắn rồi! Khi xây dựng Single Page Application (SPA) bằng Vanilla JavaScript, bạn sẽ cần quản lý các "state" cơ bản để ứng dụng hoạt động linh hoạt và hiệu quả. Mặc dù không có các thư viện quản lý state "có sẵn" như Redux hay Vuex, bạn vẫn có thể tự xây dựng hoặc áp dụng các mẫu cơ bản.

Dưới đây là các state cơ bản mà bạn sẽ thường xuyên sử dụng trong một VanillaJS SPA và cách tiếp cận để quản lý chúng:

1. State Dữ liệu Ứng dụng (Application Data State)
Đây là dữ liệu cốt lõi mà ứng dụng của bạn cần để hoạt động.

Ví dụ:

Danh sách bài viết, sản phẩm, người dùng.

Thông tin người dùng hiện tại đã đăng nhập.

Giỏ hàng (trong ứng dụng E-commerce).

Cài đặt ứng dụng (ví dụ: chế độ sáng/tối).

Cách quản lý trong VanillaJS:

Đối tượng JavaScript đơn giản: Cách đơn giản nhất là tạo một đối tượng JavaScript toàn cục (global object) hoặc một module riêng biệt để chứa tất cả dữ liệu này.

JavaScript

// store.js (hoặc appState.js)
const appState = {
    currentUser: null,
    products: [],
    cart: [],
    theme: 'light'
};

export const getAppState = () => ({ ...appState }); // Trả về bản sao để tránh thay đổi trực tiếp
export const setAppState = (newState) => {
    Object.assign(appState, newState);
    // Sau khi state thay đổi, bạn cần thông báo cho các component liên quan để render lại
    // Ví dụ: dispatch một custom event hoặc gọi hàm render của các component
    document.dispatchEvent(new CustomEvent('appStateChange', { detail: appState }));
};
Publish/Subscribe Pattern (PubSub): Để các component có thể "nghe" sự thay đổi của state và cập nhật giao diện. Khi state thay đổi, bạn sẽ "publish" một sự kiện và các component đã "subscribe" sự kiện đó sẽ nhận được thông báo và tự cập nhật.

Tự xây dựng một hệ thống PubSub đơn giản.

Sử dụng CustomEvent của trình duyệt như ví dụ trên.

Proxy Object (ES6): Đối với các ứng dụng lớn hơn, bạn có thể sử dụng Proxy để tạo một "reactive" state. Khi bất kỳ thuộc tính nào của state thay đổi, bạn có thể tự động kích hoạt quá trình re-render.

JavaScript

// store.js
const handlers = {
    set(target, property, value) {
        target[property] = value;
        // Kích hoạt re-render hoặc thông báo thay đổi
        document.dispatchEvent(new CustomEvent('stateChange', { detail: { property, value, fullState: target } }));
        return true;
    }
};
export const appState = new Proxy({
    currentUser: null,
    products: [],
}, handlers);
2. State Giao diện Người dùng (UI State)
State này liên quan trực tiếp đến cách các phần tử UI hiển thị hoặc tương tác.

Ví dụ:

Một modal có đang mở/đóng (isModalOpen: true/false).

Một menu dropdown có đang hiển thị (isMenuExpanded: true/false).

Trạng thái tải (loading) của một API call (isLoading: true/false).

Thông báo lỗi (errorMessage: '...').

Tab đang hoạt động trong giao diện tab (activeTab: 'home').

Cách quản lý trong VanillaJS:

Trong đối tượng State chung: Bạn có thể thêm các thuộc tính UI state này vào đối tượng appState của mình nếu chúng có tính chất toàn cục hoặc ảnh hưởng đến nhiều phần của ứng dụng.

Trạng thái cục bộ (Component Local State): Đối với các UI state chỉ ảnh hưởng đến một thành phần duy nhất và không cần chia sẻ, bạn có thể quản lý chúng trực tiếp bên trong logic của thành phần đó. Ví dụ, một hàm JavaScript riêng biệt hoặc một class quản lý DOM và state của riêng nó.

JavaScript

// component/Modal.js
class Modal {
    constructor(elementId) {
        this.modalElement = document.getElementById(elementId);
        this.isOpen = false;
        this.initEvents();
    }

    initEvents() {
        // Thêm event listeners để đóng/mở modal
    }

    open() {
        this.isOpen = true;
        this.modalElement.style.display = 'block';
    }

    close() {
        this.isOpen = false;
        this.modalElement.style.display = 'none';
    }
}
// const myModal = new Modal('myModal');
// myModal.open();
Sử dụng thuộc tính data-* trong HTML: Đối với các UI state rất đơn giản, bạn có thể lưu trữ chúng trực tiếp trên các phần tử DOM bằng thuộc tính data-* và cập nhật chúng bằng JavaScript.

3. State URL (URL State)
Trong SPA, URL thường được sử dụng để phản ánh trạng thái của ứng dụng, cho phép người dùng chia sẻ liên kết hoặc quay lại trạng thái trước đó.

Ví dụ:

Đường dẫn (/products, /products/123, /profile).

Tham số truy vấn (/search?q=áo&category=nam).

Hash (/#settings).

Cách quản lý trong VanillaJS:

History API: Sử dụng history.pushState() và history.replaceState() để thay đổi URL mà không tải lại trang.

window.onpopstate: Lắng nghe sự kiện này để phản ứng khi người dùng sử dụng nút "Back/Forward" của trình duyệt.

Phân tích URL: Tự viết hàm để phân tích window.location.pathname và window.location.search để trích xuất các tham số và cập nhật state của ứng dụng dựa trên chúng.

Router đơn giản: Xây dựng một router JavaScript cơ bản để ánh xạ URL đến các hàm hiển thị UI tương ứng.

4. State Form (Form State)
Khi người dùng tương tác với các biểu mẫu, các giá trị nhập liệu cũng cần được quản lý.

Ví dụ:

Giá trị hiện tại của các trường input.

Trạng thái validation (lỗi nhập liệu, trường bắt buộc).

Trạng thái gửi form (đang gửi, gửi thành công, gửi thất bại).

Cách quản lý trong VanillaJS:

Trạng thái cục bộ của form: Thường được quản lý trực tiếp trong hàm hoặc class xử lý form.

Đối tượng lưu trữ giá trị: Tạo một đối tượng JavaScript để lưu trữ giá trị của từng trường input khi người dùng nhập liệu (formData: { username: '', password: '' }).

Validation logic: Triển khai các hàm validation và cập nhật UI (hiển thị lỗi) dựa trên kết quả validation.

Tóm lại:
Khi làm VanillaJS SPA, bạn sẽ không có "thư viện" hỗ trợ quản lý state như trong các framework, nhưng bạn sẽ:

Xây dựng một đối tượng State toàn cục để chứa dữ liệu ứng dụng quan trọng.

Sử dụng mô hình Pub/Sub (hoặc CustomEvent) để thông báo các thay đổi state và kích hoạt việc cập nhật UI.

Quản lý UI state cục bộ trong các hàm/class riêng của từng thành phần.

Sử dụng History API để quản lý URL và router cơ bản.

Việc này đòi hỏi bạn phải tự quản lý nhiều hơn, nhưng cũng giúp bạn hiểu sâu hơn về cách state hoạt động trong một ứng dụng web.

## xem them

Tuyệt vời! Kết hợp VanillaJS SPA ở frontend với PHP MVC Controller trả về JSON ở backend là một kiến trúc rất phổ biến và hiệu quả. Đây là cách hoạt động của nhiều ứng dụng web hiện đại.

Vai trò của PHP MVC Controller và JSON
Trong kiến trúc này, PHP MVC Controller của bạn sẽ không còn nhiệm vụ render toàn bộ trang HTML nữa. Thay vào đó, nó sẽ tập trung vào việc:

Xử lý yêu cầu (Requests): Nhận các yêu cầu HTTP (GET, POST, PUT, DELETE) từ frontend (VanillaJS SPA).

Tương tác với Model: Gọi các phương thức từ Model để tương tác với cơ sở dữ liệu (lấy dữ liệu, lưu dữ liệu, cập nhật, xóa).

Xử lý logic nghiệp vụ: Thực hiện các quy tắc kinh doanh, xác thực dữ liệu.

Trả về dữ liệu JSON: Thay vì trả về HTML, Controller sẽ đóng gói dữ liệu đã xử lý vào định dạng JSON và gửi về cho frontend. JSON (JavaScript Object Notation) là định dạng trao đổi dữ liệu lý tưởng vì nó dễ dàng được JavaScript ở frontend phân tích và sử dụng.

Ví dụ một PHP Controller (giả định dùng Laravel hoặc framework tương tự):

PHP

<?php

namespace App\Controllers;

use App\Models\Product; // Giả sử có Product Model

class ProductController extends BaseController
{
    public function index()
    {
        $products = Product::all(); // Lấy tất cả sản phẩm từ DB
        return json_encode($products); // Trả về JSON
    }

    public function show($id)
    {
        $product = Product::find($id); // Tìm sản phẩm theo ID
        if (!$product) {
            http_response_code(404);
            return json_encode(['message' => 'Product not found']);
        }
        return json_encode($product);
    }

    public function store()
    {
        $data = json_decode(file_get_contents('php://input'), true); // Đọc dữ liệu JSON từ request body
        $product = new Product();
        $product->name = $data['name'];
        $product->price = $data['price'];
        $product->save();

        http_response_code(201); // Created
        return json_encode(['message' => 'Product created successfully', 'product' => $product]);
    }
    // ... các phương thức khác cho update, delete
}
Quản lý State trong VanillaJS SPA khi kết hợp với PHP JSON
Khi PHP Controller chỉ trả về JSON, vai trò quản lý State ở VanillaJS SPA trở nên cực kỳ quan trọng. Bạn sẽ sử dụng các kỹ thuật quản lý state đã đề cập trước đó, nhưng với trọng tâm là xử lý dữ liệu từ backend.

State Dữ liệu Server (Server Data State):

Đây sẽ là phần lớn dữ liệu bạn quản lý. Khi SPA của bạn gửi yêu cầu (ví dụ: fetch('/api/products')), PHP Controller sẽ trả về một mảng các đối tượng sản phẩm dưới dạng JSON.

Bạn sẽ lưu trữ dữ liệu này vào appState toàn cục của VanillaJS.

Ví dụ:

JavaScript

// appState.js
const appState = {
    products: [], // Dữ liệu sản phẩm từ API
    currentUser: null, // Thông tin người dùng
    isLoading: false, // Trạng thái tải
    error: null, // Thông báo lỗi
};

// main.js
async function fetchProducts() {
    appState.isLoading = true;
    // Cập nhật UI để hiển thị loading spinner
    try {
        const response = await fetch('/api/products'); // Gọi API đến PHP Controller
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Phân tích JSON từ PHP
        appState.products = data; // Cập nhật state
        appState.error = null;
    } catch (e) {
        appState.error = 'Failed to fetch products: ' + e.message;
        appState.products = []; // Xóa dữ liệu cũ nếu có lỗi
    } finally {
        appState.isLoading = false;
        // Kích hoạt re-render UI dựa trên appState.products, appState.isLoading, appState.error
        renderProductList(); // Ví dụ gọi hàm render
    }
}
Mỗi khi có thao tác (thêm, sửa, xóa sản phẩm) từ SPA, bạn sẽ gửi yêu cầu HTTP (POST, PUT, DELETE) đến PHP Controller. Sau khi PHP xử lý và trả về JSON phản hồi (ví dụ: {'message': 'Success', 'product': {id: 1, ...}}), bạn sẽ cập nhật lại appState của frontend để đồng bộ hóa.

State Giao diện Người dùng (UI State):

Vẫn được quản lý tương tự như đã nói, nhưng thường sẽ phản ứng với dữ liệu từ backend. Ví dụ: isLoading (đang tải dữ liệu từ PHP), errorMessage (lỗi trả về từ PHP API).

State URL (URL State):

Bạn sẽ sử dụng URL để phản ánh trạng thái dữ liệu hiện đang được hiển thị. Ví dụ: /products/123 có thể tương ứng với việc SPA hiển thị chi tiết sản phẩm có ID là 123. Khi URL thay đổi, bạn sẽ gửi yêu cầu đến PHP Controller để lấy dữ liệu tương ứng.

Ưu điểm của kiến trúc này:
Tách biệt rõ ràng (Separation of Concerns): Frontend (VanillaJS) chỉ lo về giao diện và tương tác người dùng. Backend (PHP MVC) chỉ lo về logic nghiệp vụ, quản lý dữ liệu và cung cấp API.

Hiệu suất: SPA tải dữ liệu động, chỉ tải lại phần cần thiết của trang, mang lại trải nghiệm nhanh hơn cho người dùng.

Linh hoạt: Frontend có thể được xây dựng bằng bất kỳ công nghệ nào (VanillaJS, React, Vue, Angular), và backend có thể phục vụ nhiều loại frontend khác nhau (web, mobile app).

Khả năng mở rộng: Dễ dàng mở rộng cả frontend và backend một cách độc lập.

Thách thức (và cách giải quyết trong VanillaJS):
Quản lý State Phức tạp: Khi ứng dụng lớn, việc quản lý appState và đảm bảo đồng bộ hóa giữa UI và state trở nên phức tạp. Bạn sẽ cần một hệ thống tốt để:

Phát hiện thay đổi state: Có thể dùng Proxy hoặc Pub/Sub (CustomEvent) như đã thảo luận.

Kích hoạt re-render: Khi state thay đổi, bạn phải tự gọi các hàm để cập nhật DOM (ví dụ: xóa các phần tử cũ và tạo lại các phần tử mới, hoặc cập nhật thuộc tính của các phần tử hiện có).

Routing: Cần xây dựng một hệ thống routing cho VanillaJS để xử lý các URL ảo mà không tải lại trang.

Quản lý HTTP Requests: Đảm bảo xử lý fetch request, lỗi, loading states một cách nhất quán.

Tóm lại, việc kết hợp VanillaJS SPA với PHP MVC Controller trả về JSON là một cách mạnh mẽ để xây dựng ứng dụng web. Nó đòi hỏi bạn phải tự quản lý nhiều khía cạnh của frontend hơn so với việc dùng các framework, nhưng cũng mang lại sự hiểu biết sâu sắc và quyền kiểm soát tuyệt đối.

Bạn có muốn đi sâu vào một khía cạnh cụ thể nào, chẳng hạn như cách xây dựng router hoặc một hệ thống quản lý state cơ bản cho VanillaJS không?