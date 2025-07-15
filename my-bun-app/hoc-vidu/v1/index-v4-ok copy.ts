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

const server = Bun.serve({
  async fetch(req) {
    const path = new URL(req.url).pathname;
    // Trang chủ
    if (path === "/") return new Response("Welcome to Bun!");
    // Chuyển hướng
    if (path === "/abc") return Response.redirect("/source", 301);
    // Trả về file hiện tại
    if (path === "/source") return new Response(Bun.file(import.meta.path));
    // Trả về JSON
    if (path === "/api") return Response.json({ some: "buns", for: "you" });
    // Nhận dữ liệu POST dạng JSON
    if (req.method === "POST" && path === "/api/post") {
      const data = await req.json();
      console.log("Received JSON:", data);
      return Response.json({ success: true, data });
    }
    // Nhận dữ liệu POST từ form
    if (req.method === "POST" && path === "/form") {
      const data = await req.formData();
      console.log(data.get("someField"));
      return new Response("Success");
    }
    // 404
    return new Response("Page not found", { status: 404 });
  },
});
console.log(`Listening on ${server.url}`);

// test post

// curl -X POST http://localhost:3000/api/post -H "Content-Type: application/json" -d '{"hello":"world"}'

// Invoke-WebRequest -Uri http://localhost:3000/api/post -Method POST -Body '{"hello":"world"}' -ContentType "application/json"

// test form

// curl -X POST http://localhost:3000/form -d "someField=demo"
// Invoke-WebRequest -Uri http://localhost:3000/form -Method POST -Body "someField=demo" -ContentType "application/x-www-form-urlencoded"