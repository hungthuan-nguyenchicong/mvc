## bộ chọn CSS cụ thể

Chào bạn, đây là cách sử dụng cụ thể của ba phương thức JavaScript phổ biến: `matches()`, `closest()`, và `includes()`.

-----

### `.matches(selector)`

Phương thức `.matches()` kiểm tra xem một phần tử **có khớp với một bộ chọn CSS cụ thể hay không**. Nó trả về `true` nếu khớp và `false` nếu không.

**Khi nào sử dụng:**
Bạn thường dùng `matches()` trong trường hợp **Event Delegation (Ủy quyền sự kiện)**. Thay vì gắn sự kiện cho nhiều phần tử con, bạn chỉ cần gắn một sự kiện duy nhất lên phần tử cha và sau đó kiểm tra xem phần tử được click có phải là phần tử bạn quan tâm không.

**Ví dụ:**

```javascript
document.addEventListener('click', (e) => {
  // e.target là phần tử cụ thể mà người dùng đã click
  // Kiểm tra xem phần tử được click có phải là nút có class 'btn' không
  if (e.target.matches('.btn')) {
    console.log('Bạn đã click vào một nút!');
  }
});
```

Trong ví dụ trên, trình lắng nghe sự kiện được gắn vào toàn bộ tài liệu (`document`). Khi có bất kỳ cú click nào xảy ra, `e.target.matches('.btn')` sẽ kiểm tra xem phần tử đích có phải là `.btn` hay không.

-----

### `.closest(selector)`

Phương thức `.closest()` tìm kiếm **phần tử cha hoặc chính nó** gần nhất khớp với một bộ chọn CSS. Nó bắt đầu tìm từ phần tử hiện tại và đi dần lên cây DOM cho đến khi tìm thấy một phần tử khớp. Nếu không tìm thấy, nó trả về `null`.

**Khi nào sử dụng:**
Khi bạn click vào một phần tử con và cần truy cập đến một phần tử cha cụ thể của nó. Đây là một cách an toàn và hiệu quả để tìm phần tử cha, thay vì sử dụng các thuộc tính như `parentNode` nhiều lần.

**Ví dụ:**

```javascript
// Giả sử có cấu trúc HTML như thế này
// <div class="card">
//   <h2>Tiêu đề</h2>
//   <p>Nội dung</p>
//   <button class="action-btn">Click</button>
// </div>

const button = document.querySelector('.action-btn');

button.addEventListener('click', (e) => {
  // Tìm thẻ cha gần nhất có class 'card'
  const cardElement = e.target.closest('.card');
  
  if (cardElement) {
    cardElement.style.backgroundColor = 'lightblue';
  }
});
```

Khi người dùng click vào nút, `e.target.closest('.card')` sẽ tìm kiếm từ nút đó và đi lên để tìm thẻ `div` có class `card`.

-----

### `.includes(value)`

Phương thức `.includes()` được sử dụng để kiểm tra xem một **chuỗi (string)** hoặc **mảng (array)** có chứa một giá trị cụ thể hay không. Nó trả về `true` nếu tìm thấy và `false` nếu không.

**Khi nào sử dụng:**

  * **Với mảng:** Để kiểm tra xem một mảng có chứa một phần tử cụ thể hay không.
  * **Với chuỗi:** Để kiểm tra xem một chuỗi có chứa một chuỗi con hay không.

**Ví dụ với mảng:**

```javascript
const userRoles = ['admin', 'editor', 'viewer'];

if (userRoles.includes('admin')) {
  console.log('Chào mừng, bạn có quyền quản trị!');
}
```

**Ví dụ với chuỗi:**

```javascript
const url = 'https://example.com/products/123';

if (url.includes('/products/')) {
  console.log('Đây là một trang sản phẩm.');
}
```

`includes()` là cách hiện đại và dễ đọc hơn so với các phương thức cũ như `indexOf()` để kiểm tra sự tồn tại.