# hoc

"scripts": {
    "dev": "bun ./backend/app.js"
  }

import { sql, serve } from "bun";
import dashboard from "./dashboard.html";
import homepage from "./index.html";

const server = serve({
  routes: {
    // ** HTML imports **
    // Bundle & route index.html to "/". This uses HTMLRewriter to scan the HTML for `<script>` and `<link>` tags, run's Bun's JavaScript & CSS bundler on them, transpiles any TypeScript, JSX, and TSX, downlevels CSS with Bun's CSS parser and serves the result.
    "/": homepage,
    // Bundle & route dashboard.html to "/dashboard"
    "/dashboard": dashboard,

    // ** API endpoints ** (Bun v1.2.3+ required)
    "/api/users": {
      async GET(req) {
        const users = await sql`SELECT * FROM users`;
        return Response.json(users);
      },
      async POST(req) {
        const { name, email } = await req.json();
        const [user] =
          await sql`INSERT INTO users (name, email) VALUES (${name}, ${email})`;
        return Response.json(user);
      },
    },
    "/api/users/:id": async req => {
      const { id } = req.params;
      const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
      return Response.json(user);
    },
  },

  // Enable development mode for:
  // - Detailed error messages
  // - Hot reloading (Bun v1.2.3+ required)
  development: true,

  // Prior to v1.2.3, the `fetch` option was used to handle all API requests. It is now optional.
  // async fetch(req) {
  //   // Return 404 for unmatched routes
  //   return new Response("Not Found", { status: 404 });
  // },
});

console.log(`Listening on ${server.url}`);
bun run app.ts

## 1

import dashboard from "./dashboard.html";
import homepage from "./index.html";

Bun.serve({
  routes: {
    "/": homepage,
    "/dashboard": dashboard,
  }

  fetch(req) {
    // ... api requests
  },
});

