## v1

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);

## v2

Install a package
Let's make our server a little more interesting by installing a package. First install the figlet package and its type declarations. Figlet is a utility for converting strings into ASCII art.

bun add figlet
bun add -d @types/figlet # TypeScript users only
Update index.ts to use figlet in the fetch handler.

import figlet from "figlet";

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const body = figlet.textSync("Bun!");
    return new Response(body);
    return new Response("Bun!");
  },
});

# env

bun --print process.env

## v2.1

import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/": index,
    "/api/hello": { GET: () => Response.json({ message: "Hello from API" }) },
  },
});

console.log(`Server running at http://localhost:${server.port}`);

### index

<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <h1>Hello World</h1>
    <script src="./app.js">&lt;/script&gt;
  </body>
</html>

## app.js

console.log("Hello from the client!");

## style

body {
  background-color: #f0f0f0;
}

