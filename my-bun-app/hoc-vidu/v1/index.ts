// //console.log("Hello via Bun!");

// const server = Bun.serve({
//   port: 3000,
//   fetch(req) {
//     return new Response("Bun!");
//   },
// });
// console.log(`Listening on http://localhost:${server.port} ...`);

// const server = Bun.serve({
//   port: 3000,
//   routes: {
//     "/": () => new Response("Trang chủ Bun!"),
//     "/hello": () => new Response("Xin chào từ Bun!"),
//     "/api/info": () => Response.json({ message: "Đây là API Bun", time: new Date().toISOString() }),
//   },
//   fetch(req) {
//     return new Response("Không tìm thấy!", { status: 404 });
//   },
// });
// console.log(`Listening on http://localhost:${server.port} ...`);

// Bun.serve({
//   port: 3000,
//   routes: {
//     "/": () => new Response("Chào mừng đến với Bun!"),
//     "/hello": () => new Response("Xin chào từ Bun!"),
//     "/api/time": () => Response.json({ time: new Date().toISOString() }),
//     "/redirect": () => Response.redirect("/"),
//     "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
//       headers: { "Content-Type": "image/x-icon" },
//     }),
//     "/api/users/:id": req => new Response(`User ID: ${req.params.id}`),
//     "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
//   },
//   fetch(req) {
//     return new Response("Không tìm thấy!", { status: 404 });
//   },
// });

// const server = Bun.serve({
//   async fetch(req) {
//     const path = new URL(req.url).pathname;
//     // Trang chủ
//     if (path === "/") return new Response("Welcome to Bun!");
//     // Chuyển hướng
//     if (path === "/abc") return Response.redirect("/source", 301);
//     // Trả về file hiện tại
//     if (path === "/source") return new Response(Bun.file(import.meta.path));
//     // Trả về JSON
//     if (path === "/api") return Response.json({ some: "buns", for: "you" });
//     // Nhận dữ liệu POST dạng JSON
//     if (req.method === "POST" && path === "/api/post") {
//       const data = await req.json();
//       console.log("Received JSON:", data);
//       return Response.json({ success: true, data });
//     }
//     // Nhận dữ liệu POST từ form
//     if (req.method === "POST" && path === "/form") {
//       const data = await req.formData();
//       console.log(data.get("someField"));
//       return new Response("Success");
//     }
//     // 404
//     return new Response("Page not found", { status: 404 });
//   },
// });
// console.log(`Listening on ${server.url}`);

// test post

// curl -X POST http://localhost:3000/api/post -H "Content-Type: application/json" -d '{"hello":"world"}'

// Invoke-WebRequest -Uri http://localhost:3000/api/post -Method POST -Body '{"hello":"world"}' -ContentType "application/json"

// test form

// curl -X POST http://localhost:3000/form -d "someField=demo"
// Invoke-WebRequest -Uri http://localhost:3000/form -Method POST -Body "someField=demo" -ContentType "application/x-www-form-urlencoded"

Bun.serve({
  routes: {
    // Route tĩnh trả về "OK"
    "/api/status": new Response("OK"),

    // Route động với tham số
    "/users/:id": req => {
      return new Response(`Hello User ${req.params.id}!`);
    },

    // Route xử lý nhiều HTTP method cho cùng endpoint
    "/api/posts": {
      GET: () => new Response("List posts"),
      POST: async req => {
        const body = await req.json();
        //return Response.json({ created: true, ...body });
        return Response.json({ created: true, ...body as Record<string, unknown>});
      },
      PUT: async req => {
        const updates = await req.json();
        //return Response.json({ updated: true, ...updates });
        return Response.json({ updated: true, ...(updates as Record<string, unknown>) });
      },
      DELETE: () => new Response(null, { status: 204 }),
    },

    "/form": {
      POST: async req => {
        const data = await req.formData();
        console.log(data.get("someField"));
        return new Response("Success");
      },
    },

    // Route wildcard cho tất cả route bắt đầu bằng /api/
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),

    // Redirect
    "/blog/hello": Response.redirect("/blog/hello/world"),

    // Phục vụ file favicon
    "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    }),
  },

  // Fallback cho route không khớp
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },

  // Xử lý lỗi toàn cục
  error(error) {
    console.error(error);
    return new Response(`Internal Error: ${error.message}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  },
});