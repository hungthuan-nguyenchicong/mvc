## Bun bằng cách thao tác với đối tượng req.cookies (một instance của Bun.CookieMap)

Bạn có thể sử dụng cookie trong Bun bằng cách thao tác với đối tượng req.cookies (một instance của Bun.CookieMap) trong các route của Bun. Bạn có thể đọc, thiết lập (set), và xóa (delete) cookie rất dễ dàng. Dưới đây là các ví dụ cụ thể:

Đọc cookie:

typescript
Bun.serve({
  routes: {
    "/profile": req => {
      // Lấy giá trị cookie từ request
      const userId = req.cookies.get("user_id");
      const theme = req.cookies.get("theme") || "light";

      return Response.json({
        userId,
        theme,
        message: "Profile page",
      });
    },
  },
});
1, 2

Thiết lập cookie:

typescript
Bun.serve({
  routes: {
    "/login": req => {
      const cookies = req.cookies;

      // Thiết lập cookie với nhiều tuỳ chọn
      cookies.set("user_id", "12345", {
        maxAge: 60 * 60 * 24 * 7, // 1 tuần
        httpOnly: true,
        secure: true,
        path: "/",
      });

      // Thêm cookie preference
      cookies.set("theme", "dark");

      // Cookie sẽ tự động được gắn vào response
      return new Response("Login successful");
    },
  },
});
1, 2

Xoá cookie:

typescript
Bun.serve({
  routes: {
    "/logout": req => {
      // Xoá cookie user_id
      req.cookies.delete("user_id", {
        path: "/",
      });

      return new Response("Logged out successfully");
    },
  },
});
1, 2

Bạn không cần thao tác thủ công với header cookie, mọi thay đổi trên req.cookies sẽ được Bun tự động gắn vào response trả về cho client.

Sources
HTTP server – API
DocsAPI
Bun llms-full.txt
