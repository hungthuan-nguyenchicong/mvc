## Viết Components với Closure trong Vanilla JavaScript

Tuyệt vời\! Bạn đang muốn kết hợp cấu trúc module và cách "include" các phần HTML vào một template literal, nhưng sử dụng **closure** trong Vanilla JavaScript. Đây là một cách tiếp cận nâng cao hơn một chút, cho phép bạn tạo ra các component có trạng thái (state) hoặc có thể xử lý các logic phức tạp hơn mà không cần framework.

-----

## Viết Components với Closure trong Vanilla JavaScript

Khi bạn nói "closure", tôi hiểu là bạn muốn các hàm render component của bạn có khả năng giữ lại trạng thái (private variables) hoặc có thể tạo ra các instance độc lập của component. Đây là một kỹ thuật mạnh mẽ trong JavaScript.

Chúng ta vẫn sẽ đi theo cấu trúc module (một file cho mỗi component), nhưng bên trong mỗi module, hàm export của bạn sẽ trả về một **hàm khác**, và hàm này chính là hàm closure.

### 1\. Cấu trúc Project (giữ nguyên)

```
src/
├── components/
│   ├── Header.js
│   ├── Sidebar.js
│   └── Footer.js
└── pages/
    └── PostPage.js
```

### 2\. Tạo các Component (Sử dụng Closure)

Thay vì xuất trực tiếp một hàm trả về HTML, giờ đây chúng ta sẽ xuất một hàm factory (hàm tạo) mà khi được gọi, nó sẽ trả về hàm render thực sự. Điều này cho phép bạn khởi tạo component với các thiết lập ban đầu và giữ trạng thái riêng cho từng instance.

-----

#### `src/components/Header.js` (Ví dụ đơn giản nhất với closure)

Ở đây, closure có thể không quá rõ ràng nếu không có trạng thái phức tạp, nhưng nó vẫn là một hàm bên trong một hàm.

```javascript
// src/components/Header.js

/**
 * Returns a function that renders the HTML for the page header.
 * This factory function allows for some initial setup if needed.
 *
 * @param {Object} [initialOptions={}] - Initial options for the header.
 * @param {string} [initialOptions.defaultTitle='My Blog'] - Default title for the header.
 * @returns {Function} A render function that takes current options and returns HTML.
 */
export function createHeaderComponent(initialOptions = {}) {
  const defaultTitle = initialOptions.defaultTitle || 'My Blog';

  // Hàm này sẽ là closure, "nhớ" được defaultTitle
  return function renderHeader(currentOptions = {}) {
    const title = currentOptions.title || defaultTitle;
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
  };
}
```

-----

#### `src/components/Sidebar.js` (Ví dụ phức tạp hơn với trạng thái bên trong closure)

Trong ví dụ này, `Sidebar` có thể có một trạng thái nội bộ, ví dụ như số lần một danh mục được click, hoặc danh sách các bài viết phổ biến được cập nhật. Dù chúng ta chỉ render HTML tĩnh ở đây, bạn có thể thấy cách `internalState` được giữ lại giữa các lần gọi `renderSidebar`.

```javascript
// src/components/Sidebar.js

/**
 * Returns a function that renders the HTML for the page sidebar.
 * This factory function allows the sidebar component to manage internal state or setup.
 *
 * @param {Object} [initialData={}] - Initial data for the sidebar.
 * @param {Array<string>} [initialData.initialCategories=[]] - Initial list of categories.
 * @returns {Function} A render function that takes current options and returns HTML.
 */
export function createSidebarComponent(initialData = {}) {
  let internalState = {
    clickCount: 0,
    categories: initialData.initialCategories || ['Default Category 1', 'Default Category 2']
  };

  // Hàm render này là closure, nó có quyền truy cập và thay đổi `internalState`
  return function renderSidebar(currentOptions = {}) {
    // Cập nhật trạng thái từ options nếu cần
    if (currentOptions.newCategory) {
      if (!internalState.categories.includes(currentOptions.newCategory)) {
        internalState.categories.push(currentOptions.newCategory);
      }
    }
    // internalState.clickCount++; // Ví dụ: tăng click count mỗi khi render

    const categoriesToDisplay = currentOptions.categories || internalState.categories;
    const categoryList = categoriesToDisplay.map(cat => `<li><a href="/category/${cat}">${cat}</a></li>`).join('');

    return `
      <aside>
        <h3>Categories (${internalState.clickCount} renders)</h3>
        <ul>
          ${categoryList}
        </ul>
        <p>Latest articles here.</p>
        <p>Internal state test: ${JSON.stringify(internalState.categories)}</p>
      </aside>
    `;
  };
}
```

-----

#### `src/components/Footer.js` (Closure đơn giản)

```javascript
// src/components/Footer.js

/**
 * Returns a function that renders the HTML for the page footer.
 *
 * @param {Object} [initialOptions={}] - Initial options for the footer.
 * @param {number} [initialOptions.startYear=new Date().getFullYear()] - The start year for copyright.
 * @returns {Function} A render function that takes current options and returns HTML.
 */
export function createFooterComponent(initialOptions = {}) {
  const startYear = initialOptions.startYear || 2023; // Có thể giữ trạng thái cố định

  return function renderFooter(currentOptions = {}) {
    const currentYear = currentOptions.year || new Date().getFullYear();
    return `
      <footer>
        <p>&copy; ${startYear}-${currentYear} My Awesome Blog. All rights reserved.</p>
      </footer>
    `;
  };
}
```

-----

### 3\. Sử dụng các Component với Closure trong trang chính (`PostPage.js`)

Bây giờ, khi bạn sử dụng các component này, bạn sẽ cần gọi hàm factory (`createHeaderComponent`, `createSidebarComponent`, v.v.) trước để lấy về hàm render thực sự.

-----

#### `src/pages/PostPage.js`

```javascript
// src/pages/PostPage.js

// Import các hàm factory component
import { createHeaderComponent } from '../components/Header.js';
import { createSidebarComponent } from '../components/Sidebar.js';
import { createFooterComponent } from '../components/Footer.js';

// Import HMR nếu bạn vẫn đang sử dụng nó cho môi trường dev
import { HMR } from '../backend/core/HMR.js';

// --- Khởi tạo các instance của component (chỉ một lần cho mỗi trang hoặc khi cần) ---
// Đây là nơi closure được tạo ra.
// Mỗi lần gọi `create...Component()`, một closure mới sẽ được tạo.
const renderHeader = createHeaderComponent({ defaultTitle: 'My Dynamic Blog' });
const renderSidebar = createSidebarComponent({
  initialCategories: ['Tech', 'LifeStyle', 'Travel']
});
const renderFooter = createFooterComponent({ startYear: 2020 });

/**
 * Renders the full HTML for a Post Page.
 * This function is intended to be used on the server-side for SSR.
 *
 * @param {Object} postData - Data for the post (e.g., title, content, author).
 * @param {Array<string>} [dynamicCategories=[]] - Dynamic categories to pass to the sidebar.
 * @returns {string} The complete HTML string for the post page.
 */
export function renderPostPage(postData, dynamicCategories = []) {
  const { title, content, author, date } = postData;

  let hmrScript = '';
  if (process.env.NODE_ENV === 'development') {
    hmrScript = HMR('frontend/post-build.js');
  }

  return /* html */`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - My Blog</title>
        <link rel="stylesheet" href="/build/frontend/post-style.css">
    </head>
    <body>
        ${renderHeader({ title: `Post: ${title}` })} <main class="post-layout">
            <article>
                <h1>${title}</h1>
                <p class="post-meta">By ${author} on ${new Date(date).toLocaleDateString()}</p>
                <div class="post-content">
                    ${content}
                </div>
            </article>

            ${renderSidebar({ categories: dynamicCategories, newCategory: 'New Dynamic Cat' })}
        </main>

        ${renderFooter({ year: new Date().getFullYear() })}

        <script type="module" src="/build/frontend/post-build.js"></script>
        ${hmrScript}
    </body>
    </html>
  `;
}

// Ví dụ về cách sử dụng (trong controller hoặc router của backend)
// const examplePost = {
//   title: 'Exploring Closures in JS Components',
//   content: '<p>This post explains how to use closures for components.</p>',
//   author: 'AI Assistant',
//   date: '2024-07-29T10:00:00Z'
// };
//
// const currentCategories = ['Vanilla JS', 'Closures', 'SSR'];
//
// const fullHtmlPage = renderPostPage(examplePost, currentCategories);
// console.log(fullHtmlPage);
```

-----

### Giải thích về việc sử dụng Closure trong Components

1.  **Hàm Factory (`create...Component`):**

      * Đây là hàm mà bạn **export** từ mỗi file component (ví dụ: `createHeaderComponent`).
      * Khi bạn gọi hàm factory này (ví dụ: `const renderHeader = createHeaderComponent({ ... });`), nó sẽ tạo ra một **phạm vi (scope) mới**.
      * Bất kỳ biến nào được khai báo trong phạm vi này (ví dụ: `defaultTitle` trong `Header.js`, `internalState` trong `Sidebar.js`) sẽ trở thành **biến riêng tư** của instance component đó.

2.  **Hàm Render (Closure):**

      * Hàm factory sẽ **trả về một hàm khác** (ví dụ: hàm `renderHeader` bên trong `createHeaderComponent`).
      * Hàm được trả về này là một **closure**. Nó "đóng" (closes over) các biến từ phạm vi của hàm factory đã tạo ra nó. Điều này có nghĩa là, ngay cả sau khi hàm factory đã thực thi xong, hàm render closure vẫn có thể truy cập và thao tác với các biến riêng tư đó.
      * Trong ví dụ `Sidebar.js`, `renderSidebar` là một closure. Nó có thể truy cập và thay đổi `internalState.categories` và `internalState.clickCount` mỗi khi nó được gọi.
      * Khi bạn sử dụng `renderSidebar({ categories: dynamicCategories })`, bạn đang gọi hàm closure này.

3.  **Lợi ích của Closure trong Components (Vanilla JS):**

      * **Quản lý trạng thái nội bộ:** Cho phép các component có "trí nhớ" về dữ liệu hoặc cấu hình của riêng chúng, không bị ảnh hưởng bởi các component khác hoặc các lần render khác (nếu bạn tạo nhiều instance của cùng một component).
      * **Đóng gói (Encapsulation):** Các biến trạng thái được bảo vệ bên trong closure và không thể truy cập trực tiếp từ bên ngoài, giúp tránh xung đột và làm code dễ bảo trì hơn.
      * **Tái sử dụng linh hoạt:** Bạn có thể tạo nhiều instance của cùng một component, mỗi instance với trạng thái và cấu hình riêng của nó.

### Khi nào nên dùng cách này?

  * Khi bạn cần các component nhỏ, có thể tái sử dụng, mà không muốn phụ thuộc vào một framework lớn như React/Vue/Angular.
  * Khi bạn cần các component có trạng thái nội bộ hoặc logic phức tạp hơn một chuỗi HTML tĩnh đơn thuần.
  * Khi bạn đang xây dựng một ứng dụng SSR với Node.js và muốn tạo ra HTML phía server một cách linh hoạt.

Tuy nhiên, đối với các ứng dụng frontend phức tạp với nhiều tương tác, các framework như React (với JSX và Virtual DOM) sẽ cung cấp một cách tiếp cận mạnh mẽ và hiệu quả hơn rất nhiều để quản lý trạng thái, cập nhật DOM và xử lý sự kiện. Cách dùng closure này chủ yếu là để mô phỏng một phần của tư duy component-based trong Vanilla JS cho mục đích SSR hoặc các ứng dụng nhẹ.