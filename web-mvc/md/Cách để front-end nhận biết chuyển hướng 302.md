## Cách để front-end nhận biết chuyển hướng 302

Để front-end nhận được chuyển hướng HTTP 302 từ server khi sử dụng `fetch`, bạn cần hiểu cách `fetch` xử lý redirect. Mặc định, `fetch` sẽ **tự động theo chuyển hướng** (redirect) và không trả về thông tin về mã trạng thái 302. Tuy nhiên, bạn có thể kiểm soát điều này bằng cách cấu hình `redirect` trong tùy chọn `fetch`.

### ✅ Cách để front-end nhận biết chuyển hướng 302

```javascript
fetch('https://example.com/api', {
  method: 'GET',
  redirect: 'manual' // Ngăn fetch tự động theo redirect
})
.then(response => {
  if (response.status === 302) {
    console.log('Redirect detected to:', response.headers.get('Location'));
  } else {
    console.log('Response status:', response.status);
  }
})
.catch(error => {
  console.error('Fetch error:', error);
});
```

### 🔍 Giải thích các tùy chọn `redirect`

| Giá trị       | Ý nghĩa                                                                 |
|---------------|-------------------------------------------------------------------------|
| `follow`      | Mặc định. Tự động theo chuyển hướng và không trả về mã 302.             |
| `manual`      | Không theo chuyển hướng. Trả về response với mã 302 và header `Location`.|
| `error`       | Nếu có chuyển hướng, fetch sẽ ném lỗi.                                  |

### ⚠️ Lưu ý

- Một số trình duyệt **không cho phép truy cập header `Location`** nếu redirect xảy ra giữa các domain khác nhau (CORS).
- Đảm bảo server gửi header `Access-Control-Expose-Headers: Location` để client có thể đọc `Location`.

---

Nếu bạn đang làm việc với API có chuyển hướng và cần xử lý nó thủ công, thì `redirect: 'manual'` là chìa khóa. Bạn đang dùng trong context nào vậy—SPA, Next.js, hay một framework khác?