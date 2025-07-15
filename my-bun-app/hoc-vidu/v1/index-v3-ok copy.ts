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

Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response("Chào mừng đến với Bun!"),
    "/hello": () => new Response("Xin chào từ Bun!"),
    "/api/time": () => Response.json({ time: new Date().toISOString() }),
    "/redirect": () => Response.redirect("/"),
    "/favicon.ico": new Response(await Bun.file("./favicon.ico").bytes(), {
      headers: { "Content-Type": "image/x-icon" },
    }),
    "/api/users/:id": req => new Response(`User ID: ${req.params.id}`),
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },
  fetch(req) {
    return new Response("Không tìm thấy!", { status: 404 });
  },
});