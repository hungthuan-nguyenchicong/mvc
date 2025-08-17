// web-mvc/src/admin/template/pages/dashboard.js

function dashboard() {
    const container = document.querySelector('.content');
    function index() {
        const htmlContent = render();
        container.innerHTML = htmlContent;
    }
    function render() {
    return /* html */ `
    <h2>Page Dashboard</h2>
    `;
    }
    return {index}
}

export {dashboard}