## Function.prototype.toString()

Có vẻ bạn muốn "đọc" một hàm, giống như cách bạn đọc nội dung của một file. Trong JavaScript, khi một hàm đã được định nghĩa trong bộ nhớ, bạn có thể xem **mã nguồn** của nó dưới dạng một chuỗi.

Tuy nhiên, có một sự khác biệt quan trọng:

  * **Đọc file:** Bạn đọc nội dung text từ một file trên ổ đĩa.
  * **"Đọc" hàm:** Bạn truy cập vào biểu diễn chuỗi của hàm đã được parse và loaded vào bộ nhớ.

-----

## Hàm để "Đọc" một Function: `Function.prototype.toString()`

Trong JavaScript, mọi hàm đều kế thừa từ `Function.prototype`, và nó có một phương thức là **`toString()`**. Khi bạn gọi `toString()` trên một hàm, nó sẽ trả về **mã nguồn JavaScript của hàm đó dưới dạng một chuỗi**.

```javascript
function myFunction() {
    console.log("This is my function!");
    // You can add more code here
    const x = 10;
    return x * 2;
}

const functionSourceCode = myFunction.toString();

console.log(functionSourceCode);
/* Output sẽ tương tự như:
function myFunction() {
    console.log("This is my function!");
    // You can add more code here
    const x = 10;
    return x * 2;
}
*/

// Ví dụ với hàm mũi tên (arrow function)
const myArrowFunction = (name) => {
    console.log(`Hello, ${name}!`);
    return `Greeting for ${name}`;
};

console.log(myArrowFunction.toString());
/* Output sẽ tương tự như:
(name) => {
    console.log(`Hello, ${name}!`);
    return `Greeting for ${name}`;
}
*/
```

-----

### Áp dụng vào ví dụ của bạn:

Nếu bạn có một hàm JavaScript đã được định nghĩa (chẳng hạn như hàm `clientSideLogic`), và bạn muốn nhúng mã nguồn của nó vào HTML, bạn có thể làm thế này:

```javascript
// web-mvc/backend/admin/views/login/login-page.js

function clientSideLogic() {
    // Đây là toàn bộ logic JavaScript client-side của bạn
    console.log('Nội dung JS từ hàm được "đọc" trực tiếp!');
    document.addEventListener('DOMContentLoaded', () => {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                alert('Login button clicked!');
            });
        }
    });
}

function loginPage() {
    function render() {
        // Lấy mã nguồn của hàm clientSideLogic()
        const scriptContent = clientSideLogic.toString();

        return /* html */ `
            <h1>Login</h1>
            <button id="loginButton">Click Me</button>
            <script>
                // Nhúng mã nguồn của hàm vào đây.
                // Chúng ta sẽ cần thực thi nó sau khi nhúng.
                (${scriptContent})(); // Gọi IIFE sau khi nó được chèn vào
            </script>
        `;
    }

    return {
        render
    }
}

export default loginPage();
```

-----

### Giải thích:

1.  **Định nghĩa hàm `clientSideLogic()`**: Bạn định nghĩa hàm chứa tất cả logic JavaScript frontend của mình.
2.  **`clientSideLogic.toString()`**: Tại thời điểm `render()` được gọi, chúng ta gọi `toString()` trên hàm `clientSideLogic`. Điều này sẽ trả về một chuỗi chứa toàn bộ định nghĩa của hàm đó, bao gồm cả nội dung bên trong.
3.  **Nhúng vào `<script>`**: Chuỗi này (`scriptContent`) sau đó được chèn vào giữa thẻ `<script></script>`.
4.  **Thực thi hàm nhúng**: Vì `toString()` chỉ trả về định nghĩa của hàm (ví dụ: `function clientSideLogic() { ... }`), bạn cần bao bọc nó trong `(...)()` để biến nó thành một **Immediately Invoked Function Expression (IIFE)** và thực thi nó ngay lập tức sau khi nó được chèn vào DOM.

### Ưu và Nhược điểm của cách này:

**Ưu điểm:**

  * **Tổ chức mã JavaScript**: Bạn có thể giữ logic JavaScript của mình trong một hàm riêng biệt trong cùng một file, giúp mã có cấu trúc hơn thay vì viết trực tiếp vào template literal.
  * **Không cần đọc file I/O**: Không cần sử dụng `fs` để đọc file từ ổ đĩa, vì hàm đã có sẵn trong bộ nhớ.

**Nhược điểm:**

  * **Không có caching:** Tương tự như việc nhúng trực tiếp nội dung file, trình duyệt sẽ không thể cache mã JavaScript này.
  * **Mã nguồn hiển thị rõ ràng:** Toàn bộ mã nguồn hàm sẽ hiển thị trong HTML của client.
  * **Phức tạp khi debug:** Có thể hơi khó khăn hơn để debug mã JavaScript khi nó được nhúng theo cách này so với file `.js` độc lập.
  * **Không dùng được `import`/`export`:** Mã JavaScript được "đọc" bằng `toString()` sẽ không thể sử dụng các cú pháp module như `import` hoặc `export` bên trong nó, vì nó không được coi là một module.

Cách này là một kỹ thuật thú vị và có thể hữu ích cho các đoạn script nhỏ, cụ thể, nhưng đối với các ứng dụng lớn hơn hoặc khi hiệu suất là ưu tiên, việc sử dụng `<script src="...">` vẫn là lựa chọn tốt nhất.

## học thêm cơ bản

//web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        const scriptRender = script.toString();
        return /* html */ `
            <h1>Login</h1>
            <script>
                (${scriptRender})()
            </script>
        `;
        
    }
    function script() {
        console.log(1)
    }
    return {
        render
    }
}

export default loginPage();

## học thêm clouse

//web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        const scriptRender = script.toString();

        // Bước 1: Gọi hàm script2() để nhận được đối tượng { script3 }
        const script2Result = script2(); 
        
        // Bước 2: Truy cập thuộc tính script3 từ đối tượng nhận được và gọi toString()
        const testClouse = script2Result.script3.toString(); 

        return /* html */ `
            <h1>Login</h1>
            <script>
                // Thực thi script từ hàm script()
                (${scriptRender})(); 
                // Thực thi script từ hàm script3()
                (${testClouse})(); 
            </script>
        `;
    }

    function script() {
        console.log(1);
    }

    function script2() {
        function script3() {
            console.log(3);
            // Bạn có thể thêm nhiều logic khác cho script3 ở đây
        }
        return { script3 };
    }

    return {
        render
    };
}

export default loginPage();