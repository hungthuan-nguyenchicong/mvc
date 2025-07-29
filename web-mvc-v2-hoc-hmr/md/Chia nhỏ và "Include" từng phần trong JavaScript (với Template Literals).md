## Chia nhỏ và "Include" từng phần trong JavaScript (với Template Literals)

Tuyệt vời, câu hỏi của bạn rất hay và chạm đến một kỹ thuật quan trọng trong việc xây dựng các trang web lớn: **làm sao để chia nhỏ code HTML/JS thành các phần có thể tái sử dụng (components) và sau đó "include" chúng vào một trang chính một cách dễ dàng, đặc biệt là khi bạn muốn sử dụng chúng trong các template literals (`` ` ``)**.

Trong môi trường JavaScript hiện đại (và đặc biệt khi kết hợp với Server-Side Rendering - SSR), chúng ta không dùng cú pháp `@header.js` trực tiếp trong template literal như một preprocessor PHP hay Blade. Thay vào đó, chúng ta sẽ **import các hàm hoặc biến chứa nội dung HTML/logic của component** và sau đó gọi/sử dụng chúng bên trong template literal.

-----

## Chia nhỏ và "Include" từng phần trong JavaScript (với Template Literals)

Cách tiếp cận hiệu quả là tạo ra các module JavaScript riêng biệt cho từng phần (Header, Sidebar, Footer, v.v.), trong đó mỗi module sẽ **export một hàm hoặc một chuỗi HTML** đại diện cho phần đó. Sau đó, bạn import các export này vào file trang chính và gọi chúng để chèn nội dung vào template literal.

### 1\. Cấu trúc project

Hãy giữ cấu trúc tương tự như ví dụ trước để dễ hình dung:

```
src/
├── components/
│   ├── Header.js
│   ├── Sidebar.js
│   └── Footer.js
└── pages/
    └── PostPage.js  // Trang chính chứa các phần
```

### 2\. Tạo các Component (Module JavaScript)

Mỗi file component sẽ export một hàm (hoặc hằng số) trả về chuỗi HTML.

-----

#### `src/components/Header.js`

Đây là một hàm đơn giản trả về chuỗi HTML của header.

```javascript
// src/components/Header.js

/**
 * Renders the HTML for the page header.
 * @param {Object} [options={}] - Options for the header.
 * @param {string} [options.title='My Website'] - The title to display in the header.
 * @returns {string} The HTML string for the header.
 */
export function renderHeader(options = {}) {
  const title = options.title || 'My Website';
  return `
    <header>
      <h1>${title}</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  `;
}
```

-----

#### `src/components/Sidebar.js`

Tương tự cho sidebar.

```javascript
// src/components/Sidebar.js

/**
 * Renders the HTML for the page sidebar.
 * @param {Object} [options={}] - Options for the sidebar.
 * @param {Array<string>} [options.categories=[]] - List of categories to display.
 * @returns {string} The HTML string for the sidebar.
 */
export function renderSidebar(options = {}) {
  const categories = options.categories || [];
  const categoryList = categories.map(cat => `<li><a href="/category/${cat}">${cat}</a></li>`).join('');

  return `
    <aside>
      <h3>Categories</h3>
      <ul>
        ${categoryList}
      </ul>
      <p>Latest articles here.</p>
    </aside>
  `;
}
```

-----

#### `src/components/Footer.js`

Và cho footer.

```javascript
// src/components/Footer.js

/**
 * Renders the HTML for the page footer.
 * @param {Object} [options={}] - Options for the footer.
 * @param {number} [options.year=new Date().getFullYear()] - The copyright year.
 * @returns {string} The HTML string for the footer.
 */
export function renderFooter(options = {}) {
  const year = options.year || new Date().getFullYear();
  return `
    <footer>
      <p>&copy; ${year} My Awesome Blog. All rights reserved.</p>
    </footer>
  `;
}
```

-----

### 3\. Sử dụng các Component trong trang chính (`PostPage.js`)

Bây giờ, trong file trang chính của bạn (ví dụ: `PostPage.js`), bạn sẽ **import** các hàm `renderHeader`, `renderSidebar`, `renderFooter` và gọi chúng bên trong template literal để xây dựng toàn bộ trang.

-----

#### `src/pages/PostPage.js`

```javascript
// src/pages/PostPage.js

// Import các hàm render từ các component đã tạo
import { renderHeader } from '../components/Header.js';
import { renderSidebar } from '../components/Sidebar.js';
import { renderFooter } from '../components/Footer.js';

// Import HMR nếu bạn vẫn đang sử dụng nó cho môi trường dev
import { HMR } from '../backend/core/HMR.js'; // Điều chỉnh đường dẫn theo cấu trúc project của bạn

/**
 * Renders the full HTML for a Post Page.
 * This function is intended to be used on the server-side for SSR.
 *
 * @param {Object} postData - Data for the post (e.g., title, content, author).
 * @param {Array<string>} [categories=[]] - Categories for the sidebar.
 * @returns {string} The complete HTML string for the post page.
 */
export function renderPostPage(postData, categories = []) {
  const { title, content, author, date } = postData;

  let hmrScript = '';
  // Chỉ thêm HMR script trong môi trường phát triển
  // `process.env.NODE_ENV` sẽ được thiết lập bởi môi trường Node.js hoặc Webpack
  if (process.env.NODE_ENV === 'development') {
    hmrScript = HMR('frontend/post-build.js'); // Tên bundle JS cho trang post
  }

  return /* html */`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - My Blog</title>
        <link rel="stylesheet" href="/build/frontend/post-style.css"> </head>
    <body>
        ${renderHeader({ title: 'My Awesome Blog' })} <main class="post-layout">
            <article>
                <h1>${title}</h1>
                <p class="post-meta">By ${author} on ${new Date(date).toLocaleDateString()}</p>
                <div class="post-content">
                    ${content} </div>
            </article>

            ${renderSidebar({ categories: categories })} </main>

        ${renderFooter({ year: 2024 })} <script type="module" src="/build/frontend/post-build.js"></script>
        ${hmrScript}
    </body>
    </html>
  `;
}

// Ví dụ về cách sử dụng (thường là trong controller hoặc router của backend)
// const examplePost = {
//   title: 'Understanding Modern JavaScript Imports',
//   content: '<p>This is the dynamic content of the post...</p><p>It can include paragraphs, images, etc.</p>',
//   author: 'AI Assistant',
//   date: '2024-07-29T10:00:00Z'
// };
//
// const availableCategories = ['JavaScript', 'Web Development', 'SSR', 'Frontend', 'Backend'];
//
// const fullHtmlPage = renderPostPage(examplePost, availableCategories);
// console.log(fullHtmlPage);
```

-----

### Giải thích cách hoạt động và lợi ích

1.  **Chia nhỏ (Modularity):** Mỗi phần (header, sidebar, footer) là một module JavaScript riêng biệt. Điều này giúp code sạch sẽ, dễ quản lý, và có thể tái sử dụng ở nhiều trang khác nhau mà không cần copy/paste.
2.  **Import Tĩnh (Static Imports):** Khi bạn dùng `import { renderHeader } from '../components/Header.js';`, đây là một **import tĩnh**. Điều này có nghĩa là khi bạn chạy công cụ build (như Webpack, Rollup), nó sẽ:
      * Phát hiện các `import` này trong `PostPage.js`.
      * **Gom tất cả code từ `Header.js`, `Sidebar.js`, `Footer.js` vào file `PostPage.js`** (hoặc một bundle lớn hơn mà `PostPage.js` nằm trong).
      * Kết quả là, khi file `PostPage.js` (hoặc bundle chứa nó) được tải và thực thi trên server (cho SSR) hoặc trình duyệt, **toàn bộ nội dung của các component con đã có sẵn**. Không có bất kỳ hành vi tải động nào cho các component này.
3.  **Sử dụng trong Template Literals:** Bên trong template literal của `renderPostPage`, bạn chỉ cần gọi các hàm đã import (ví dụ: `${renderHeader()}`) và kết quả trả về (chuỗi HTML) sẽ được nhúng trực tiếp vào chuỗi HTML lớn của trang.
4.  **Truyền dữ liệu (Props):** Bạn có thể truyền dữ liệu động vào các component con thông qua đối số của hàm (ví dụ: `renderHeader({ title: 'My Awesome Blog' })`). Điều này giúp các component linh hoạt hơn.
5.  **SSR Friendly:** Vì tất cả các phần đều được `import` tĩnh và gom lại thành một file, server Node.js của bạn có thể dễ dàng `require` hoặc `import` `PostPage.js` và gọi `renderPostPage` để tạo ra HTML hoàn chỉnh. Không cần phải chờ đợi bất kỳ tài nguyên nào được tải động.
6.  **HMR:** Logic HMR (`${hmrScript}`) vẫn được thêm vào ở phần cuối `<body>` để phục vụ cho quá trình phát triển, cho phép bạn cập nhật code JavaScript frontend mà không cần tải lại toàn bộ trang.

### Tóm lại

Bạn không dùng `@header.js` trực tiếp như một cú pháp đặc biệt trong template literal. Thay vào đó, bạn **import** các module JavaScript chứa logic render HTML và sau đó **gọi các hàm/biến đã import đó** bên trong template literal của trang chính của bạn. Công cụ build sẽ lo phần gom các file này lại thành một file duy nhất, đáp ứng yêu cầu của SSR và hiệu suất.