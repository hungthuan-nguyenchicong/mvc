## header HTTP

Để hiểu rõ luồng hoạt động của cookie mà không phụ thuộc vào Bun, chúng ta có thể tạo một lớp (class) đơn giản để thao tác trực tiếp với các header HTTP. Điều này sẽ giúp bạn thấy cách thức server nhận và gửi cookie như thế nào.

Dưới đây là một ví dụ về một lớp **`CookieManager`** đơn giản, có hai phương thức chính là **`get`** và **`set`**. Lớp này sẽ mô phỏng cách Bun xử lý cookie nhưng ở mức độ cơ bản nhất, tập trung vào việc đọc và ghi header.

-----

### Lớp `CookieManager` đơn giản trong Node.js

```typescript
class CookieManager {
  private requestHeaders: Headers;
  private newCookies: string[] = [];

  constructor(requestHeaders: Headers) {
    this.requestHeaders = requestHeaders;
  }

  /**
   * Phương thức get() để đọc giá trị cookie từ header 'Cookie' của request
   */
  get(name: string): string | undefined {
    const cookieHeader = this.requestHeaders.get('Cookie');
    if (!cookieHeader) {
      return undefined;
    }

    // Phân tích header 'Cookie'
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return value;
      }
    }

    return undefined;
  }

  /**
   * Phương thức set() để thiết lập cookie mới cho response
   */
  set(name: string, value: string, options: { maxAge?: number; path?: string; httpOnly?: boolean; secure?: boolean } = {}): void {
    let cookieString = `${name}=${value}`;

    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; Path=${options.path}`;
    }

    if (options.httpOnly) {
      cookieString += `; HttpOnly`;
    }

    if (options.secure) {
      cookieString += `; Secure`;
    }

    // Lưu chuỗi cookie để sau đó thêm vào header 'Set-Cookie' của response
    this.newCookies.push(cookieString);
  }

  /**
   * Phương thức để lấy các chuỗi Set-Cookie đã được tạo
   * Phương thức này sẽ được gọi khi bạn gửi response
   */
  getSetCookieHeaders(): string[] {
    return this.newCookies;
  }
}

// --- Ví dụ sử dụng ---
// Giả lập một request từ client
const clientRequestHeaders = new Headers();
clientRequestHeaders.set('Cookie', 'user_id=12345; theme=dark');

// Bước 1: Server nhận request và đọc cookie
const cookieManager_Get = new CookieManager(clientRequestHeaders);
const userId = cookieManager_Get.get('user_id'); // Lấy được '12345'
const theme = cookieManager_Get.get('theme'); // Lấy được 'dark'

console.log('Đọc cookie từ request:');
console.log('User ID:', userId);
console.log('Theme:', theme);

console.log('--------------------');

// Bước 2: Server muốn thiết lập cookie mới
// Giả lập một request khác, server muốn set cookie mới
const cookieManager_Set = new CookieManager(new Headers());

// Thiết lập một cookie mới
cookieManager_Set.set('session_token', 'abcdef123456', {
  maxAge: 3600, // 1 giờ
  httpOnly: true,
  path: '/',
});

// Thiết lập một cookie khác
cookieManager_Set.set('language', 'vi');

// Lấy các header Set-Cookie để gắn vào response của server
const setCookieHeaders = cookieManager_Set.getSetCookieHeaders();

console.log('Các header Set-Cookie để gửi về client:');
setCookieHeaders.forEach(header => {
  console.log('Set-Cookie:', header);
});
```

### Giải thích luồng hoạt động

1.  **Đọc Cookie (Phương thức `get`)**:

      * Phương thức này nhận vào một `Headers` object từ request đến của client.
      * Nó lấy giá trị của header **`Cookie`**.
      * Nó chia chuỗi cookie thành các cặp `key=value` và tìm giá trị của `name` mà bạn yêu cầu.

2.  **Thiết lập Cookie (Phương thức `set`)**:

      * Phương thức này nhận vào tên, giá trị và các tùy chọn của cookie.
      * Nó **tự xây dựng một chuỗi cookie** hoàn chỉnh, bao gồm các thuộc tính như `Max-Age`, `Path`, `HttpOnly`,...
      * Nó lưu trữ các chuỗi này vào một mảng **`newCookies`** thay vì gắn trực tiếp vào response ngay lập tức. Điều này mô phỏng cách Bun tổng hợp các cookie đã thiết lập và gửi chúng đi cùng một lúc.

3.  **Gửi Response**:

      * Khi server hoàn thành xử lý và sẵn sàng gửi response, nó sẽ gọi **`getSetCookieHeaders()`** để lấy tất cả các chuỗi cookie đã được thiết lập.
      * Sau đó, server sẽ thêm từng chuỗi cookie này vào header **`Set-Cookie`** của response.

Lớp này cho thấy cách server phải **phân tích chuỗi** cookie từ request và **tự xây dựng chuỗi** header `Set-Cookie` để gửi đi. Nó là một bước trung gian hữu ích giúp bạn thấy rõ hơn những gì đang diễn ra "dưới mui xe" của các framework như Bun.
