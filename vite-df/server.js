function render() {
    return /* html */ `
        <h1>Test Page</h1>
        <div class="test">Test</div>
        <script type="module" src="http://localhost:5173/src/main.js"></script>
        <script type="module" src="http://localhost:5173/@vite/client"></script>
    `;
}

Bun.serve({
  routes: {
    "/": () =>
      new Response(render(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }),
  },
});