// ./src/page/test.js
import('../css/test.css');
if (import.meta.hot) {
  // HMR APIs are available.
  import.meta.hot.accept()
}
function renderPageTest() {
    const html = render();
    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    })
    //return new Response ('abcsef');
}

function render() {
    return /* html */ `
        <h1>Test Page abc d</h1>
        <div class="test">Test</div>
        <script type="module" src="/src/js/test-main.js"></script>
    `;
}

export default renderPageTest();

//console.log(import.meta.url);