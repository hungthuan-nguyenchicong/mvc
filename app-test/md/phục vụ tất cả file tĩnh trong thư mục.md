## phục vụ tất cả file tĩnh trong thư mục

Bun.serve({
  routes: {
    "/src/*": async req => {
      const filePath = new URL(req.url).pathname;
      // Loại bỏ dấu "/" đầu và trỏ tới file tương ứng trong thư mục src
      const file = Bun.file("." + filePath);
      if (await file.exists()) {
        return new Response(await file.stream());
      }
      return new Response("Not Found", { status: 404 });
    },
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});


console.log(import.meta.url);