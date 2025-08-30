// backend/admin/core/HMR.js
function HMR(script = null) {
  return `
    <script type="module" src="http://localhost:4000/@vite/client"></script>
    <script type="module" src="http://localhost:4000/src/${script}"></script>
    `;
}

// backend/admin/views/login-page.js
function loginPage() {
  let hmr = "";
  if (import.meta.env.NODE_ENV === "development") {
    hmr = HMR("backend/login-build.js");
  }
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${hmr}
    </body>
    </html>
    `;
}

// backend/admin/core/RoutesAdmin.js
var RoutesAdmin = {
  "/admin/": new Response("/"),
  "/admin/login": {
    GET: () => new Response(loginPage(), { headers: { "Content-Type": "text/html" } })
  }
};

// server.js
Bun.serve({
  routes: {
    "/": () => new Response(render(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    }),
    "/test-socket": () => new Response(testSocket(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    }),
    ...RoutesAdmin
  }
});
