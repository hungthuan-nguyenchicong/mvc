# url front end

## url
const href = window.location.href;
## url patname
// Lấy đường dẫn (pathname) từ URL hiện tại
  const currentPath = window.location.pathname;
 ## url search
// Lấy phần querystring từ URL hiện tại (window.location.search)
const queryString = window.location.search;

// Tạo một đối tượng URLSearchParams từ chuỗi truy vấn
const params = new URLSearchParams(queryString);

// Lấy giá trị của một tham số cụ thể
const queryValue = params.get('q'); // Kết quả: "javascript"
const pageValue = params.get('page'); // Kết quả: "1"
const nonExistentValue = params.get('sort'); // Kết quả: null

console.log('Giá trị của "q":', queryValue);
console.log('Giá trị của "page":', pageValue);
console.log('Giá trị của "sort":', nonExistentValue);

// Kiểm tra xem một tham số có tồn tại hay không
const hasQuery = params.has('q'); // Kết quả: true
const hasSort = params.has('sort'); // Kết quả: false

console.log('Có tham số "q" không?', hasQuery);
console.log('Có tham số "sort" không?', hasSort);

// Lặp qua tất cả các tham số
console.log('--- Tất cả các tham số:');
for (const [key, value] of params.entries()) {
  console.log(`${key}: ${value}`);
}
// Kết quả:
// q: javascript
// page: 1

## pustState click link
document.addEventListener('click', (e) => {

  history.pushState(null, null, href);

## chức năng tiến lên và lùi lại của trình duyệt (nút Back/Forward)
window.addEventListener('popstate', (e) => {
        adminRouterFrontend();
    })