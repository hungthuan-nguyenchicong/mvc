# máy chủ Express của bạn là điểm vào chính

Backend proxying to Vite with Express is a common setup in a development environment, especially if your backend needs to render the initial HTML for SSR (Server-Side Rendering). This setup reverses the roles compared to the previous example: your Express server is the primary entry point, and it proxies requests to the Vite dev server for frontend assets and HMR (Hot Module Replacement).

### How it Works

1.  **Primary Server**: Your Node.js Express server is the main entry point for all requests (e.g., running on port 3000).
2.  **Asset Proxy**: When a request for a frontend asset (like a `.js` or `.css` file) comes in, the Express server's middleware checks the URL. If the URL matches a Vite asset path (e.g., `/src/main.js`, or the HMR path `/@vite/client`), it forwards the request to the running Vite dev server (e.g., on port 5173).
3.  **HTML Handling**: For the main HTML page request (e.g., `/`), the Express server can choose to either serve a static HTML file or perform SSR by rendering the application and sending the HTML to the client.

This setup is ideal for SSR because the backend controls the initial page load, and the Vite dev server handles the fast asset serving and HMR for a great developer experience.

-----

### Step-by-Step Setup

1.  **Install the Proxy Middleware**: You'll need a proxy middleware for Express, such as `http-proxy-middleware`.

    ```bash
    npm install http-proxy-middleware --save-dev
    ```

2.  **Configure Express Server**: In your Express server file, set up the proxy. You can also handle the main HTML request here.

    **`server.js`**

    ```javascript
    const express = require('express');
    const { createProxyMiddleware } = require('http-proxy-middleware');
    const path = require('path');
    const app = express();
    const port = 3000;

    // Middleware để proxy các yêu cầu đến Vite dev server
    app.use(
      '/', // Proxy tất cả các yêu cầu
      createProxyMiddleware({
        target: 'http://localhost:5173', // URL của Vite dev server
        changeOrigin: true,
        // Chỉ proxy các yêu cầu không phải là API hoặc các file tĩnh
        // Điều này giúp tránh việc lặp vô tận
        filter: (pathname, req) => {
          // Tránh proxy các yêu cầu API và các file tĩnh
          return !pathname.startsWith('/api') && !pathname.startsWith('/static');
        },
      })
    );

    // Xử lý các yêu cầu API
    app.get('/api/users', (req, res) => {
      res.json({ id: 1, name: 'Jane Doe' });
    });

    app.listen(port, () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });
    ```

    This configuration tells Express to forward most requests to Vite, but to handle its own API routes.

3.  **Run Both Servers**: You'll need to run both the Vite dev server and your Express server simultaneously. You can use a package like `concurrently` for this.

    ```bash
    npm install concurrently --save-dev
    ```

    **`package.json`**

    ```json
    "scripts": {
      "dev": "concurrently \"node server.js\" \"vite\""
    }
    ```

Now, when you run `npm run dev`, both servers will start. Requests from the browser will first hit your Express server, which will then proxy to Vite for frontend assets, giving you the benefit of Vite's fast HMR while maintaining a backend-driven architecture.