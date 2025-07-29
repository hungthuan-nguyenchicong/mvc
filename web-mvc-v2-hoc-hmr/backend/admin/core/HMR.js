// /var/www/html/app/mvc/web-mvc/backend/admin/core/HMR.js

function HMR(script = null) {
    //const script = script;
    return /* html */ `
    <script type="module" src="http://localhost:4000/@vite/client"></script>
    <script type="module" src="http://localhost:4000/src/${script}"></script>
    `;

}

export {HMR}