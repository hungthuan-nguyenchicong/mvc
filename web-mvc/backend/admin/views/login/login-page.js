// web-mvc/backend/admin/views/login/login-page.js
import { HMR } from "../../../core/HMR";
async function loginPage(nonce = null) {
    let hmr = '';
    if (import.meta.env.NODE_ENV === 'development') {
        hmr = HMR('/src/login.js');
    } else {
        hmr = await scriptFrontend(nonce);
    }
    //console.log(hmr)
    return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Page</title>
            ${style(nonce)}

        </head>
        <body>
            ${htmlForm()}
            <!-- <script type="module" src="/src/login.js"></script> -->
            ${hmr}
        </body>
        </html>
    `;

    function style(nonce) {
        return /* html */ `
        <style nonce="${nonce}">
            body {
                width: 100%;
            }
            .container {
                padding: 100px;
                text-align:center;
            }
            #login {
                margin: auto;
                width: 300px;
                display: grid;
                grid-template-columns: 1fr;
                gap: 1px;
            }
            #login input {
                font-size: x-large;
            }
            #login button {
                font-size: x-large;
            }
        </style>
        `;
    }

    function htmlForm() {
        return /* html */ `
        <div class="container">
            <h1>Login</h1>
            <form id="login" action="/admin/login" method="POST">
                <input type="text" name="username" id="username" placeholder="User Name" autocomplete="username"><br>
                <input type="password" name="password" id="password" placeholder="Password" autocomplete="current-password"><br>
                <button type="submit">Login</button>
            </form>
        </div>
        `
    }
}

async function scriptFrontend(nonce) {
    // const scriptRender = import('./login-frontend.js').toString();
    const scriptRender = await Bun.file('backend/admin/views/login/login-frontend.js').text();
    return /* html */ `
    <script nonce="${nonce}">
        ${scriptRender}
    </script>
    `;
    // console.log(2)
}

//export {scriptFrontend};

export { loginPage };