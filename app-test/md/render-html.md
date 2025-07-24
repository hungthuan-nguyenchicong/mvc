## render

function render() {
    return /* html */ `
        <h1>Test Page abc d</h1>
        <div class="test">Test</div>
        <script type="module" src="/src/js/test-main.js"></script>
    `;
}

Bun.serve({
  routes: {
    "/test": () =>
      new Response(render(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }),
  },
});