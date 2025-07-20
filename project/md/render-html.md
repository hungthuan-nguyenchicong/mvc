Ví dụ đơn giản: Trả về HTML trực tiếp từ Bun

// server.ts
import { serve } from "bun";

serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bun HTML Page</title>
            <style>
                body { font-family: sans-serif; background-color: #f0f0f0; }
                h1 { color: #333; }
                p { color: #666; }
            </style>
        </head>
        <body>
            <h1>Hello from Bun!</h1>
            <p>This HTML was rendered directly from a Bun server-side script.</p>
            <button onclick="alert('Hello from client-side JavaScript!')">Click Me</button>
            <script>
                // This is client-side JavaScript, it runs in the browser
                console.log('Client-side JavaScript loaded!');
            </script>
        </body>
        </html>
      `;
      // Quan trọng: Thiết lập Content-Type header để trình duyệt hiểu đây là HTML
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Bun server serving HTML on http://localhost:3000");