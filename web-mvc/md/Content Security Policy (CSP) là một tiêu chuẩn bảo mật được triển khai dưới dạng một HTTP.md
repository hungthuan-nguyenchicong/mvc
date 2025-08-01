## Content Security Policy (CSP) là một tiêu chuẩn bảo mật được triển khai dưới dạng một HTTP

Tất nhiên rồi\! Content Security Policy (CSP) là một lớp bảo mật quan trọng, và việc nó tương tác với inline script (như cách bạn đang làm) là một điểm cần hiểu rõ.

### Content Security Policy (CSP) là gì?

Content Security Policy (CSP) là một tiêu chuẩn bảo mật được triển khai dưới dạng một HTTP response header (hoặc meta tag trong HTML). Mục đích chính của nó là giúp ngăn chặn các cuộc tấn công **Cross-Site Scripting (XSS)** và các hình thức tấn công tiêm mã (code injection) khác bằng cách chỉ định **những nguồn tài nguyên (script, style, images, fonts, media, v.v.) nào được phép tải và thực thi** trên trang web của bạn.

Nói một cách đơn giản, CSP giống như một "danh sách trắng" (whitelist) cho trình duyệt của người dùng. Trình duyệt sẽ chỉ tải hoặc thực thi các tài nguyên đến từ các nguồn được bạn cho phép trong chính sách. Bất kỳ tài nguyên nào đến từ nguồn không được phép sẽ bị chặn, ngay cả khi kẻ tấn công bằng cách nào đó đã tiêm được mã vào trang của bạn.

**Ví dụ một header CSP:**
`Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' data:;`

Header này nói với trình duyệt:

  * `default-src 'self'`: Mặc định, chỉ cho phép tải tài nguyên từ cùng một nguồn gốc (`'self'`, tức là domain của trang web).
  * `script-src 'self' https://trusted.cdn.com`: Chỉ cho phép tải script từ cùng một nguồn gốc (`'self'`) hoặc từ `https://trusted.cdn.com`.
  * `img-src 'self' data:`: Chỉ cho phép tải ảnh từ cùng một nguồn gốc hoặc từ URI dữ liệu (`data:` cho ảnh nhúng trực tiếp).

### CSP và Inline Script (Vấn đề của bạn)

Theo mặc định, một CSP nghiêm ngặt sẽ **chặn tất cả các script được nhúng trực tiếp trong HTML** (inline script), cũng như các trình xử lý sự kiện inline (như `onclick="alert(1)"`).

**Lý do:** Kẻ tấn công XSS thường tiêm mã độc dưới dạng inline script. Bằng cách chặn chúng, CSP làm giảm đáng kể bề mặt tấn công của XSS.

**Khi bạn nhúng JavaScript trực tiếp vào thẻ `<script>` như thế này:**

```html
<script>
    console.log(123)
    const span = document.createElement('span');
    span.innerHTML = 'abc';
    document.body.appendChild(span);
</script>
```

...thì đây là một **inline script**. Nếu CSP của bạn được thiết lập mà không có ngoại lệ cho inline script, trình duyệt sẽ thấy thẻ `<script>` này và **ngay lập tức chặn nó, không thực thi bất kỳ code nào bên trong**, và báo lỗi trong console của trình duyệt (thường là "Refused to execute inline script because it violates the following Content Security Policy directive...").

### Các giải pháp để làm việc với Inline Script trong CSP

Để cho phép inline script khi có CSP, bạn có ba lựa chọn chính (theo thứ tự khuyến nghị):

#### 1\. Sử dụng `nonce` (Number Once - Số chỉ dùng một lần) - **Được khuyến nghị**

Đây là phương pháp tốt nhất và an toàn nhất cho các script được tạo ra một cách động (như khi bạn SSR).

  * **Cách hoạt động:**

    1.  Mỗi khi server render một trang, nó tạo ra một **chuỗi ngẫu nhiên, độc nhất** (nonce) cho phiên đó.
    2.  Chuỗi nonce này được đưa vào header CSP (`script-src 'nonce-RANDOMSTRING'`).
    3.  Cùng chuỗi nonce đó được thêm vào thuộc tính `nonce` của thẻ `<script>` inline.
    4.  Trình duyệt sẽ chỉ thực thi thẻ `<script>` inline nếu thuộc tính `nonce` của nó khớp với nonce trong header CSP.
    5.  Vì nonce là ngẫu nhiên và chỉ dùng một lần cho mỗi request, kẻ tấn công rất khó đoán được nonce hợp lệ để tiêm mã của họ.

  * **Ví dụ:**

    **Bước 1: Trên Server (Node.js/Bun - trong `server.js` hoặc handler route của bạn)**

    ```javascript
    import crypto from 'crypto'; // Để tạo nonce ngẫu nhiên

    // ... trong app.get('/login', (req, res) => { ...
    const nonce = crypto.randomBytes(16).toString('base64'); // Tạo nonce

    // Khi tạo header CSP
    res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' 'nonce-${nonce}';`
        // Thêm các directive khác nếu cần
    );

    // Truyền nonce này vào hàm loginPage để nó có thể được nhúng vào thẻ <script>
    const pageHtml = await loginPage(nonce); // Cần truyền nonce vào đây
    res.send(pageHtml);
    // ...
    ```

    **Bước 2: Trong hàm `scriptFrontendInlineProd()` của bạn (trong `login-page.js`)**
    Bạn cần sửa đổi hàm `scriptFrontendInlineProd` (và `loginPage`) để nhận nonce và thêm nó vào thẻ `<script>`:

    ```javascript
    // login-page.js
    // ...
    async function loginPage(nonce = '') { // Thêm tham số nonce
        let scriptInjection = '';
        if (process.env.NODE_ENV === 'development') {
            // ... logic cho dev, nonce không cần thiết ở đây vì HMR dùng src="..."
        } else {
            scriptInjection = await scriptFrontendInlineProd(nonce); // Truyền nonce vào đây
        }
        // ...
        return /* html */ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                ...
            </head>
            <body>
                ...
                ${scriptInjection}
            </body>
            </html>
        `;
    }

    async function scriptFrontendInlineProd(nonce) { // Nhận nonce
        const frontendFilePath = path.join(__dirname, '..', 'admin', 'views', 'login', 'login-frontend.js');
        try {
            const fileContent = await Bun.file(frontendFilePath).text();
            // Thêm thuộc tính nonce vào thẻ <script>
            return /* html */ `
                <script nonce="${nonce}">
                    document.addEventListener('DOMContentLoaded', () => {
                        ${fileContent}
                        if (typeof initializeLoginPage === 'function') {
                            initializeLoginPage();
                        }
                    });
                </script>
            `;
        } catch (error) {
            console.error(`Error reading login-frontend.js for inline script:`, error);
            return '';
        }
    }
    export { loginPage };
    ```

#### 2\. Sử dụng `hash` - **Khuyến nghị cho các script tĩnh không thay đổi**

  * **Cách hoạt động:**

    1.  Bạn tính toán **hash SHA256, SHA384 hoặc SHA512** của **toàn bộ nội dung script inline**.
    2.  Hash này được đưa vào header CSP (`script-src 'sha256-BASE64HASH'`).
    3.  Trình duyệt sẽ chỉ thực thi thẻ `<script>` inline nếu hash của nội dung của nó khớp với hash trong CSP.

  * **Khi sử dụng:** Phù hợp nhất cho các script inline mà **không thay đổi** giữa các lần request. Với script được tạo động như của bạn, việc tính toán hash cho mỗi request sẽ tốn tài nguyên hơn nonce và ít linh hoạt hơn.

  * **Ví dụ (concept):**

    ```javascript
    const scriptContent = `
        document.addEventListener('DOMContentLoaded', () => {
            // ... code từ login-frontend.js ...
        });
    `;
    const hash = crypto.createHash('sha256').update(scriptContent).digest('base64');

    res.setHeader(
        'Content-Security-Policy',
        `script-src 'self' 'sha256-${hash}';`
    );
    // ... render HTML với scriptContent
    ```

#### 3\. Sử dụng `'unsafe-inline'` - **KHÔNG ĐƯỢC KHUYẾN NGHỊ**

  * **Cách hoạt động:** Đơn giản là bạn thêm `'unsafe-inline'` vào directive `script-src` trong CSP của mình.
  * **Ví dụ:** `Content-Security-Policy: script-src 'self' 'unsafe-inline';`
  * **Vấn đề:** Điều này **vô hiệu hóa hoàn toàn** khả năng bảo vệ XSS của CSP đối với inline script. Nó cho phép bất kỳ script inline nào được thực thi, dù là của bạn hay của kẻ tấn công tiêm vào. **Tránh sử dụng điều này trừ khi tuyệt đối không còn lựa chọn nào khác và bạn hiểu rõ rủi ro.**

### Tóm lại

Nếu bạn muốn nhúng inline script cho trang login của mình để tránh cache và giảm request, hãy **sử dụng `nonce` là giải pháp an toàn và hiệu quả nhất**. Nó cho phép bạn vẫn giữ được bảo mật cao của CSP trong khi vẫn thực hiện được yêu cầu kỹ thuật của bạn.