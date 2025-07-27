## xay dung DOM

Bạn muốn xây dựng cấu trúc DOM (cây DOM) bằng JavaScript, bắt đầu từ `document.body` và muốn viết nhiều logic hơn với JavaScript thay vì sử dụng string template literals. Đây là một cách tiếp cận mạnh mẽ hơn, cho phép bạn thao tác DOM linh hoạt và tương tác hơn.

Hãy cùng phân tích đoạn code bạn đưa ra và mở rộng nó để xây dựng một cây DOM phức tạp hơn.

-----

## Phân tích `document.body.createElement('div');`

Ngay lập tức, dòng này có một lỗi cú pháp:
`document.body.createElement('div');`

Phương thức `createElement()` là một phương thức của đối tượng `document`, không phải của `document.body`. Bạn cần gọi nó trực tiếp từ `document`.

**Sửa lỗi:**
`const div = document.createElement('div');`

-----

## Xây dựng Cây DOM với JavaScript

Bây giờ, hãy tạo một ví dụ đầy đủ hơn về việc xây dựng một cấu trúc DOM phức tạp, bao gồm các phần tử, thuộc tính, nội dung text, và thêm vào `document.body`.

**`web-mvc/backend/admin/views/login/login-page.js`**

```javascript
function loginPage() {
    function render() {
        // --- 1. Tạo container chính ---
        const mainContainer = document.createElement('div');
        mainContainer.id = 'login-container';
        mainContainer.classList.add('flex-center', 'full-height'); // Thêm class CSS
        
        // --- 2. Tạo tiêu đề ---
        const h1 = document.createElement('h1');
        h1.textContent = 'Login to Admin Panel'; // Sử dụng textContent để thêm text an toàn
        h1.style.color = '#333'; // Thêm style inline
        
        // --- 3. Tạo form đăng nhập ---
        const form = document.createElement('form');
        form.id = 'loginForm';
        form.method = 'POST'; // Đặt thuộc tính method
        form.action = '/admin/login'; // Đặt thuộc tính action

        // --- 4. Tạo các trường input và label ---
        // Username
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username:';
        usernameLabel.htmlFor = 'username'; // Liên kết label với input
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.name = 'username';
        usernameInput.placeholder = 'Enter your username';
        usernameInput.required = true;

        // Password
        const passwordLabel = document.createElement('label');
        passwordLabel.textContent = 'Password:';
        passwordLabel.htmlFor = 'password';
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.name = 'password';
        passwordInput.placeholder = 'Enter your password';
        passwordInput.required = true;

        // --- 5. Tạo nút submit ---
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Log In';
        submitButton.classList.add('btn', 'btn-primary'); // Thêm nhiều class

        // --- 6. Gắn kết các phần tử lại với nhau (xây dựng cây DOM) ---
        // Thêm label và input vào form (có thể dùng div bao bọc để dễ styling)
        const usernameDiv = document.createElement('div');
        usernameDiv.appendChild(usernameLabel);
        usernameDiv.appendChild(usernameInput);

        const passwordDiv = document.createElement('div');
        passwordDiv.appendChild(passwordLabel);
        passwordDiv.appendChild(passwordInput);

        form.appendChild(usernameDiv);
        form.appendChild(passwordDiv);
        form.appendChild(submitButton);

        // --- 7. Thêm tiêu đề và form vào container chính ---
        mainContainer.appendChild(h1);
        mainContainer.appendChild(form);

        // --- 8. (Quan trọng) Thêm container chính vào body của tài liệu
        // document.body.appendChild(mainContainer);
        // HOẶC trả về mainContainer để nó được chèn vào vị trí thích hợp bởi framework/controller
        
        // --- 9. Tạo một phần tử script để chứa logic client-side ---
        // Để tích hợp với ví dụ class/function.toString() trước đó
        const scriptElement = document.createElement('script');
        // Giả sử ClientModule và initMethodRender được định nghĩa ở đây, 
        // hoặc được import/định nghĩa ở scope cha
        
        // Bạn sẽ cần thay đổi cấu trúc của login-page.js để có thể truy cập 
        // ClientModule.toString() ở đây nếu ClientModule không phải global.
        // Cách tốt nhất là định nghĩa Class ClientModule LÊN TRÊN HÀM RENDER
        // trong loginPage(), để nó là một Closure.
        
        // VÍ DỤ TẠM THỜI:
        const clientSideLogic = `
            // Định nghĩa Class ClientModule (cần có ở đây hoặc được đưa vào scope này)
            class ClientModule {
                constructor() { console.log("ClientModule constructor running from dynamic script."); }
                init() { 
                    console.log("ClientModule init running from dynamic script.");
                    const dynamicForm = document.getElementById('loginForm');
                    if (dynamicForm) {
                        dynamicForm.addEventListener('submit', (event) => {
                            event.preventDefault();
                            alert('Dynamic form submitted!');
                            console.log('Form submitted dynamically from ClientModule!');
                        });
                    }
                }
            }
            const clientApp = new ClientModule();
            clientApp.init();
        `;
        scriptElement.textContent = clientSideLogic;


        // Nếu bạn muốn hàm render này trực tiếp sửa đổi DOM:
        // document.body.innerHTML = ''; // Xóa nội dung cũ của body nếu cần
        // document.body.appendChild(mainContainer);
        // document.body.appendChild(scriptElement);

        // NHƯNG TRONG KIẾN TRÚC MVC CỦA BẠN, render() TRẢ VỀ CHUỖI HTML.
        // Bạn sẽ phải chuyển đổi cây DOM này thành chuỗi HTML để trả về.
        // Đây là lý do tại sao string template literals thường được dùng cho render() trong MVC.
        // Để chuyển đổi Node sang HTML string:
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(mainContainer);
        tempDiv.appendChild(scriptElement); // Thêm script vào đây nếu muốn nó là một phần của chuỗi HTML
        
        // Trả về chuỗi HTML của cây DOM bạn vừa xây dựng
        return tempDiv.innerHTML;
    }

    // Các hàm/class khác trong loginPage()
    // Ví dụ: ClientModule cần được định nghĩa ở đây để render() có thể truy cập toString()
    class ClientModule {
        constructor() {
            this.message = "ClientModule initialized!";
            // console.log("ClientModule constructor running."); // Không log ở đây nếu bạn muốn nó chỉ log khi chạy trên trình duyệt
        }
        init() {
            console.log(this.message);
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    console.log('Form submitted from ClientModule (static definition)!');
                    // alert('Login process initiated!');
                });
            } else {
                console.log('Login form not found on the page (static definition).');
            }
        }
    }


    return { render }
}

export { loginPage };
```

-----

### Giải thích và Những cân nhắc quan trọng:

1.  **`document.createElement(tagName)`:** Tạo một phần tử HTML mới.
2.  **`element.id`, `element.className`, `element.classList.add()`:** Gán ID, class cho phần tử. `classList.add()` tốt hơn `className` khi bạn muốn thêm nhiều class mà không ghi đè cái cũ.
3.  **`element.textContent` vs `element.innerHTML`:**
      * `textContent`: Dùng để thêm nội dung văn bản thuần túy. An toàn hơn vì nó tự động thoát (escape) các ký tự HTML đặc biệt, ngăn chặn XSS.
      * `innerHTML`: Dùng để thêm nội dung HTML dưới dạng chuỗi. Cần cẩn thận với XSS nếu nội dung đến từ người dùng.
4.  **`element.setAttribute(name, value)` / `element.property = value`:**
      * Bạn có thể dùng `setAttribute('id', 'myId')` hoặc `element.id = 'myId'`.
      * Với các thuộc tính phổ biến như `id`, `src`, `href`, `value`, `type`, v.v., việc gán trực tiếp qua `element.property = value` thường được ưa dùng vì ngắn gọn và trực quan.
      * Với các thuộc tính custom data attributes (ví dụ: `data-id`), bạn phải dùng `setAttribute`.
5.  **`parent.appendChild(child)`:** Đây là cách chính để xây dựng cây DOM. Bạn thêm một phần tử con vào cuối của phần tử cha.
6.  **`document.body.appendChild()`:** Nếu bạn muốn hàm `render()` trực tiếp thêm nội dung vào DOM hiện có của trang (thường dùng trong Single Page Applications - SPAs), bạn sẽ sử dụng lệnh này.
7.  **Trong kiến trúc MVC của bạn:**
      * Controller của bạn (`LoginController.js`) mong đợi hàm `render()` trả về một **chuỗi HTML**.
      * Vì vậy, bạn không thể trực tiếp dùng `document.body.appendChild()` bên trong hàm `render()` rồi trả về `undefined`.
      * Bạn cần xây dựng cây DOM bằng JavaScript như ví dụ trên, sau đó **chuyển đổi cây DOM đó thành một chuỗi HTML** để trả về. Đây là lý do tôi thêm `tempDiv.innerHTML`.

### Ưu và Nhược điểm của việc xây dựng DOM bằng JavaScript so với Template Literals:

**Xây dựng DOM bằng JavaScript (`createElement`, `appendChild`, v.v.):**

  * **Ưu điểm:**
      * **Linh hoạt cao:** Dễ dàng thêm/xóa các phần tử, gán sự kiện, thay đổi thuộc tính, cập nhật UI động.
      * **An toàn hơn:** Khi sử dụng `textContent`, `setAttribute`, giảm thiểu rủi ro XSS.
      * **Dễ dàng thao tác:** Bạn có thể lưu trữ các tham chiếu đến các phần tử trong biến và thao tác chúng sau này.
  * **Nhược điểm:**
      * **Dài dòng:** Mã code có thể rất dài dòng cho các cấu trúc HTML phức tạp.
      * **Khó đọc:** Đặc biệt với DOM lồng nhau sâu, việc đọc và hình dung cấu trúc HTML có thể khó khăn.
      * **Hiệu suất:** Với lượng lớn thao tác DOM, có thể ảnh hưởng đến hiệu suất (mặc dù các trình duyệt hiện đại đã tối ưu hóa nhiều).

**Sử dụng String Template Literals (` html  ` \`...\`\`):**

  * **Ưu điểm:**
      * **Ngắn gọn:** Rất ngắn gọn và dễ đọc cho các cấu trúc HTML tĩnh hoặc ít biến động.
      * **Trực quan:** Dễ hình dung cấu trúc HTML.
      * **Nhanh chóng:** Dễ dàng viết và chỉnh sửa.
  * **Nhược điểm:**
      * **Nguy cơ XSS:** Cao nếu bạn chèn dữ liệu không an toàn (ví dụ từ người dùng) trực tiếp vào chuỗi mà không thoát (escape) chúng.
      * **Khó thao tác sau này:** Nếu bạn muốn thêm sự kiện hoặc cập nhật một phần tử cụ thể sau khi HTML đã được render, bạn phải tìm phần tử đó bằng `document.getElementById()`, `querySelector()`, v.v.
      * **Kém linh hoạt:** Khó thay đổi cấu trúc động sau khi chuỗi đã được tạo.

**Lời khuyên:**

  * Trong kiến trúc MVC phía server của bạn, nơi hàm `render()` trả về HTML để server gửi đi, **string template literals thường là lựa chọn thực tế và hiệu quả hơn** vì mục tiêu là tạo ra một chuỗi HTML cuối cùng.
  * Bạn có thể kết hợp cả hai: Tạo cấu trúc HTML chính bằng template literals, và sau đó (trên client-side, trong các script được nhúng) sử dụng JavaScript để thao tác DOM, thêm sự kiện, cập nhật UI động khi cần.

Ví dụ trên cho thấy bạn có thể tạo DOM bằng JavaScript hoàn toàn, nhưng để nó phù hợp với yêu cầu trả về HTML string của controller, bạn phải dùng thủ thuật `tempDiv.innerHTML`.