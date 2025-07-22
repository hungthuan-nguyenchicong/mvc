## Viết Vanilla JS theo Phong cách Hook

Bạn hoàn toàn **có thể học và viết Vanilla JS theo phong cách "hook"**, mặc dù không có các hàm `useState` hay `useEffect` tích hợp sẵn như React. "Hook" ở đây dựa trên nguyên lý của **closures (bao đóng)** và **quản lý trạng thái cục bộ (local state management)**. 💡

-----

## Viết Vanilla JS theo Phong cách Hook

Khi nói đến "hook" trong Vanilla JS, chúng ta đang muốn mô phỏng lại khả năng của React Hooks:

1.  **Quản lý trạng thái (State Management):** Một cách để khai báo và cập nhật trạng thái mà không cần một class.
2.  **Xử lý hiệu ứng phụ (Side Effects):** Một cách để chạy code sau khi DOM được cập nhật hoặc khi một giá trị nào đó thay đổi.
3.  **Tái sử dụng logic (Logic Reusability):** Khả năng đóng gói logic trạng thái và hiệu ứng phụ vào các hàm có thể tái sử dụng.

### Nguyên lý chính: Closures (Bao đóng) 🔒

**Closure** là khả năng của một hàm ghi nhớ và truy cập vào phạm vi bên ngoài của nó, ngay cả khi hàm bên ngoài đã thực thi xong. Đây là nền tảng để tạo ra các hàm "hook-like" trong Vanilla JS.

**Ví dụ cơ bản về Closure để quản lý trạng thái:**

```javascript
function createCounter() {
  let count = 0; // Biến `count` nằm trong phạm vi của createCounter

  return {
    // Hàm này (closure) ghi nhớ và có thể truy cập `count`
    getCount: function() {
      return count;
    },
    // Hàm này (closure) ghi nhớ và có thể cập nhật `count`
    increment: function() {
      count++;
    },
    decrement: function() {
      count--;
    }
  };
}

const counter1 = createCounter(); // Tạo một instance counter độc lập
console.log(counter1.getCount()); // 0
counter1.increment();
counter1.increment();
console.log(counter1.getCount()); // 2

const counter2 = createCounter(); // Tạo một instance counter khác
console.log(counter2.getCount()); // 0 (Độc lập với counter1)
counter2.increment();
console.log(counter2.getCount()); // 1
```

Trong ví dụ trên, `getCount`, `increment`, `decrement` là các closures. Chúng "đóng lại" biến `count` từ phạm vi của `createCounter`, cho phép mỗi đối tượng `counter1` và `counter2` có trạng thái `count` riêng biệt.

-----

## Mô phỏng `useState` và `useEffect` trong Vanilla JS

Bạn có thể tự xây dựng các phiên bản đơn giản của `useState` và `useEffect` bằng Vanilla JS để hiểu rõ hơn nguyên lý.

### 1\. Mô phỏng `useState`

```javascript
function useStateVanilla(initialValue) {
  let state = initialValue; // Trạng thái được lưu trong closure

  function setState(newValue) {
    state = newValue;
    // Đây là nơi bạn sẽ kích hoạt quá trình "re-render" thành phần của bạn
    // Trong thực tế, bạn cần một cơ chế để biết khi nào cần cập nhật DOM
    console.log(`State updated to: ${state}. (Need to re-render DOM here)`);
    // Ví dụ đơn giản: cập nhật một phần tử DOM cụ thể
    // updateDomElement();
  }

  return [state, setState]; // Trả về cặp giá trị và hàm cập nhật
}

// Sử dụng:
function MyComponent() {
  const [count, setCount] = useStateVanilla(0);
  const [name, setName] = useStateVanilla("World");

  console.log(`Rendering MyComponent: Count is ${count}, Name is ${name}`);

  // Mô phỏng tương tác người dùng
  setTimeout(() => {
    setCount(count + 1); // Gọi setState, nhưng không tự động re-render toàn bộ component
  }, 1000);

  setTimeout(() => {
    setName("Vanilla JS");
  }, 2000);
}

MyComponent();
```

**Thách thức:** Phần khó nhất là làm thế nào để `setState` tự động kích hoạt quá trình re-render (cập nhật lại DOM) của thành phần mà nó thuộc về. Trong React, framework lo phần này. Trong Vanilla JS, bạn phải tự quản lý việc này (ví dụ: thông qua một hàm `render` được gọi lại, hoặc sử dụng Proxy để theo dõi thay đổi).

### 2\. Mô phỏng `useEffect`

`useEffect` trong React dùng để quản lý các tác dụng phụ sau khi DOM đã được cập nhật. Trong Vanilla JS, bạn có thể mô phỏng nó bằng cách chạy code sau khi một hàm render nào đó hoàn tất, hoặc theo dõi sự thay đổi của biến.

```javascript
// Rất đơn giản, không có clean-up hoặc dependencies array như useEffect thực
function useEffectVanilla(callback, dependencies = []) {
  // Trong thực tế, bạn cần lưu trữ giá trị dependencies trước đó
  // và chỉ chạy callback nếu dependencies thay đổi
  // Đối với ví dụ đơn giản này, ta giả định nó luôn chạy hoặc quản lý bên ngoài
  
  // Đây là nơi bạn sẽ gọi callback sau khi DOM đã sẵn sàng hoặc sau một sự kiện
  console.log('Running effect callback...');
  callback();

  // Để mô phỏng dependencies, bạn cần một cơ chế lưu trữ và so sánh state cũ/mới
  // và một vòng lặp để kiểm tra các thay đổi đó.
}

// Sử dụng trong một "component"
function AnotherComponent() {
  // Giả sử `data` là một state được quản lý bởi useStateVanilla
  const [data, setData] = useStateVanilla("initial data");

  useEffectVanilla(() => {
    console.log(`Data changed to: ${data}. Performing side effect.`);
    // Ví dụ: gửi request API dựa trên `data`
  }, [data]); // Mô phỏng dependencies

  // Mô phỏng thay đổi data
  setTimeout(() => {
    setData("new data loaded");
  }, 1500);
}

AnotherComponent();
```

**Thách thức:** `useEffect` thực sự phức tạp hơn rất nhiều, nó bao gồm cơ chế clean-up, chạy lại khi dependencies thay đổi, và quản lý các lifecycle. Việc mô phỏng đầy đủ đòi hỏi một framework nhỏ.

-----

## Nguyên lý cơ bản để viết "hook-like" Vanilla JS

1.  **Closures (Bao đóng):** Là nền tảng để tạo ra các biến trạng thái cục bộ và các hàm có thể truy cập/thay đổi trạng thái đó mà không gây xung đột.
2.  **Định hướng hàm (Function-oriented):** Tổ chức code thành các hàm nhỏ, có mục đích cụ thể.
3.  **Tách biệt mối quan tâm (Separation of Concerns):** Tách biệt logic quản lý trạng thái, logic hiệu ứng phụ và logic tạo/cập nhật DOM.
4.  **Cơ chế cập nhật DOM:** Đây là phần bạn phải tự xây dựng hoặc sử dụng một thư viện nhỏ gọn. Có thể là:
      * **Manual DOM Manipulation:** Thay đổi DOM trực tiếp bằng `document.createElement`, `appendChild`, `textContent`, v.v. (giống như bạn đang làm).
      * **Templating Engines:** Sử dụng các thư viện như Lit HTML, htm, hoặc thậm chí là template literals để tạo HTML rồi chèn vào DOM.
      * **Simple Virtual DOM (Tự xây dựng):** Một phiên bản cực kỳ đơn giản để so sánh và cập nhật DOM hiệu quả hơn (rất phức tạp để tự làm).

**Tóm lại:** Bạn hoàn toàn có thể viết Vanilla JS theo phong cách Functional Programming và sử dụng các nguyên lý như closures để tạo ra các hàm quản lý trạng thái và hiệu ứng tương tự như "hooks". Đây là một cách học rất tốt để hiểu sâu hơn về cách các framework frontend hoạt động. Tuy nhiên, để xây dựng một ứng dụng lớn, bạn có thể sẽ muốn dùng một thư viện frontend thực sự (như React, Vue, Svelte) để có được các "hooks" mạnh mẽ, tối ưu và được hỗ trợ tốt.

## v2

Sounds like a solid plan\! Using **functions for tasks and user interactions, and then leveraging custom hooks (built with closures and composition) for bundling reusable stateful/effectful logic**, is a highly effective and modern approach in Vanilla JS, especially with your MVC structure.

-----

## Strategy: Functions for Tasks, Custom Hooks for Reusable Logic

Here's how this strategy breaks down with your MVC model:

### 1\. **Functions for Basic Interactions & Rendering (View/Controller Layer)** 🎯

This is where simple, focused functions shine. They're great for:

  * **View Rendering:** Functions that take data and return HTML strings or DOM elements. These are often **pure functions**, making them easy to test and predictable.
      * Example: `createButton(text, onClick)`, `renderUserCard(user)`.
  * **Event Handlers:** Functions that respond to user actions.
      * Example: `handleLoginSubmit(event)`, `handleClick(e)`.
  * **Simple Logic:** Utility functions, data transformations.
      * Example: `formatDate(date)`, `validateEmail(email)`.

**Benefit:** These functions are straightforward, don't carry their own state (they receive state as arguments), and are highly reusable in isolation.

### 2\. **Custom Hooks for Stateful/Effectful Logic (Controller/Model Interaction)** 📦

This is where you'll use the "hook-like" pattern, built on closures, to encapsulate more complex, reusable logic that involves:

  * **State Management:** When a piece of UI or a specific feature needs to maintain its own internal state across interactions or renders (e.g., a counter, a form's input values, a loading state).
  * **Side Effects:** Actions that interact with the outside world (e.g., fetching data from an API, setting up event listeners that need cleanup, interacting with local storage).
  * **Reusable Logic:** Any stateful or effectful logic that you find yourself writing repeatedly across different parts of your application.

**How it works (under the hood):** These custom "hooks" are just functions that leverage **closures** to keep track of their internal state and provide functions to update that state. They effectively create a private scope for their state that persists between calls.

**Example: A "useFetch" Custom Hook**

Let's say you frequently fetch data. You can create a custom hook:

```javascript
// src/hooks/useFetch.js
export function useFetch(url, initialData = null) {
    let data = initialData;
    let loading = true;
    let error = null;
    let subscribers = []; // A simple way to notify components

    // Function to update state and notify subscribers
    function setState(newData, newLoading, newError) {
        data = newData;
        loading = newLoading;
        error = newError;
        subscribers.forEach(cb => cb()); // Notify listeners
    }

    // The effect to perform the fetch
    function executeFetch() {
        setState(initialData, true, null); // Reset and set loading
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(fetchedData => {
                setState(fetchedData, false, null);
            })
            .catch(err => {
                setState(null, false, err);
                console.error("Fetch error:", err);
            });
    }

    // This simulates useEffect for initial load
    // In a real scenario, you'd need a more robust system for dependencies
    // For simplicity here, we assume it's called once or based on external triggers
    executeFetch(); // Initial fetch

    // A simple subscribe/unsubscribe pattern for updates (like useState's re-render)
    function subscribe(callback) {
        subscribers.push(callback);
        return () => {
            subscribers = subscribers.filter(cb => cb !== callback);
        };
    }

    return { data, loading, error, refetch: executeFetch, subscribe };
}
```

**Using the Custom Hook in a Component (e.g., a Controller in MVC):**

```javascript
// src/admin/controllers/UserListController.js
import { useFetch } from '../../hooks/useFetch.js';
import { createUserListElement } from '../views/UserListView.js'; // A function to render the view

export function UserListController(containerElement) {
    const { data: users, loading, error, refetch, subscribe } = useFetch('/api/users');

    // Simple re-render mechanism for Vanilla JS
    function render() {
        if (loading) {
            containerElement.innerHTML = '<p>Loading users...</p>';
        } else if (error) {
            containerElement.innerHTML = `<p>Error: ${error.message}</p>`;
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Retry';
            retryButton.onclick = refetch; // Call the refetch function from the hook
            containerElement.appendChild(retryButton);
        } else {
            containerElement.innerHTML = '';
            containerElement.appendChild(createUserListElement(users));
        }
    }

    // Subscribe to changes from the hook to re-render
    const unsubscribe = subscribe(render);

    // Initial render
    render();

    // Return a cleanup function (important for SPAs)
    return () => {
        unsubscribe(); // Unsubscribe when the component is removed
    };
}

// In your SPA's router:
// const userListContainer = document.getElementById('user-list-section');
// const cleanupUserList = UserListController(userListContainer);
// When navigating away: cleanupUserList();
```

### 3\. **MVC Structure Considerations**

  * **Model:** Still typically manages data logic, interactions with databases/APIs. These can be **functions** or **classes** (if you like OOP for your models like `User` or `Product`).
  * **View:** Primarily **functions** that take data and return UI (HTML strings or DOM elements).
  * **Controller:** This is where you'll orchestrate things. A controller function would:
      * Initialize UI elements.
      * Attach event listeners (using simple functions).
      * **Use your custom hooks** to manage state, fetch data, etc.
      * Call view functions to update the DOM based on state from hooks or models.

-----

## Conclusion

Your proposed strategy is excellent\!

  * **Functions** are perfectly suited for basic rendering, event handling, and utility tasks, keeping your code clean and focused.
  * **Custom hooks (using closures)** will allow you to encapsulate and reuse the more complex stateful and side-effect logic, providing a very elegant way to manage component behavior without the boilerplate of classes.

This approach will give you the benefits of functional programming's predictability and reusability, while still allowing you to structure your application effectively within an MVC paradigm.