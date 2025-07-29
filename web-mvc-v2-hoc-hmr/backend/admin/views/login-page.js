// web-mvc/src/backend/views/login-page.js
import { HMR } from "../core/HMR";
function loginPage() {
    let hmr = '';
    if (import.meta.env.NODE_ENV === 'development') {
        hmr = HMR('backend/login-build.js')
    }
    return /* html */`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${hmr}
    </body>
    </html>
    `;
}
//const hmr = HMR('backend/login-build.js')
// ${hmr}
export {loginPage}


function loginHot() {
    const h2 = `<h2>h2</h2>`;
    document.body.innerHTML=h2
}

export {loginHot}