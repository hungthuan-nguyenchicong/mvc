## Trong Bun, import.meta.env là alias của process.env

Trong Bun, biến import.meta.env là alias của process.env, vì vậy import.meta.env.DEV sẽ phản ánh giá trị tương ứng từ biến môi trường. Nếu bạn muốn kiểm tra môi trường phát triển, bạn nên sử dụng giá trị của process.env.NODE_ENV. Ví dụ, khi process.env.NODE_ENV === "development", import.meta.env.NODE_ENV cũng sẽ là "development"

## kiểm tra trong bun

const isDev = import.meta.env.NODE_ENV === "development";

const scriptBaseUrl = isDev ? 'http://localhost:5173/' : '/';
const scriptPath = 'admin-dist/login-main.js';