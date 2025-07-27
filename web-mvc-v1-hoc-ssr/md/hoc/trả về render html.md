# Trả về text/html với Response

Tuyệt vời\! Rất vui được biết bạn đã hiểu rõ hơn về `Response.json()`. Đó là một tiện ích cực kỳ hữu ích trong lập trình web hiện đại.

-----

### Trả về `text/html` với `Response`

Bạn hỏi có hàm tiện ích nào tương tự `Response.json()` để trả về `Content-Type: text/html` không. Câu trả lời là **không có một phương thức tiện ích tĩnh trực tiếp** như `Response.html()` được tích hợp sẵn trong Fetch API (hoặc các runtime như Bun/Node.js) như cách `Response.json()` hoạt động.

Tuy nhiên, việc trả về `text/html` rất đơn giản. Bạn chỉ cần sử dụng **constructor `new Response()`** và thiết lập `Content-Type` header một cách tường minh.

Dưới đây là cách bạn có thể làm:

```javascript
// Ví dụ trên server (Bun, Node.js 18+, Deno, hoặc Service Worker trong trình duyệt)

// Giả sử bạn có một chuỗi HTML
const myHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chào mừng bạn!</title>
        <style>
            body { font-family: sans-serif; margin: 2em; background-color: #f0f0f0; }
            h1 { color: #333; }
            p { color: #666; }
        </style>
    </head>
    <body>
        <h1>Xin chào từ Server!</h1>
        <p>Đây là nội dung HTML được tạo ra và gửi về.</p>
        <p>Thời gian hiện tại ở TP. Hồ Chí Minh là: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
    </body>
    </html>
`;

// Để trả về HTML, bạn sẽ tạo một Response mới
return new Response(myHtmlContent, {
    status: 200, // Mã trạng thái HTTP
    headers: {
        'Content-Type': 'text/html; charset=utf-8' // Đặt Content-Type là text/html
    }
});
```

### Giải thích:

  * **`new Response(body, options)`**: Đây là cách cơ bản và linh hoạt nhất để tạo một đối tượng phản hồi.
      * **`body`**: Đối số đầu tiên là nội dung bạn muốn gửi. Trong trường hợp này, đó là chuỗi HTML của bạn.
      * **`options`**: Đối số thứ hai là một đối tượng chứa các tùy chọn cấu hình, bao gồm `status` (mã trạng thái HTTP, ví dụ `200` cho OK, `404` cho Not Found) và `headers` (các tiêu đề HTTP).
  * **`'Content-Type': 'text/html; charset=utf-8'`**: Đây là phần quan trọng nhất. Bằng cách thiết lập header này, bạn thông báo cho trình duyệt hoặc client rằng nội dung mà nó nhận được là HTML và nên được hiển thị như một trang web. Thêm `charset=utf-8` là một thực hành tốt để đảm bảo hiển thị đúng các ký tự đặc biệt và tiếng Việt.

-----

Mặc dù không có `Response.html()` tiện lợi như `Response.json()`, việc sử dụng `new Response()` để trả về HTML vẫn rất trực quan và không hề phức tạp.

Bạn có câu hỏi nào khác về cách xử lý phản hồi trong JavaScript không?