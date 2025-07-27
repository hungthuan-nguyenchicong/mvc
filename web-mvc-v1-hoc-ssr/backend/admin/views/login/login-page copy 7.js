// web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        //const styleFrontendRender = styleFrontend.toString();
        const sctiptFrontendRender = scriptFrontend.toString();
        const testRenderString = testRender.toString();
        return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            ${styleFrontend}
        </head>
        <body>
            <script>
                ${testRenderString}
                (${sctiptFrontendRender})();
            </script>
        </body>
        </html>
        `;
    }
    return {render}
}

const styleFrontend = /* html */`
    <style>
        h1 {
            color: red;
        }
        #login {
            color: blue;
        }
    </style>
`;

function testRender() {
    function render() {
        console.log(1)
    }
    render();
}

function scriptFrontend() {
    function render() {
        // login h1
        const title = document.createElement('h1');
        title.innerHTML= 'Login';
        document.body.appendChild(title);
        // login form
        const form = document.createElement('form');
        form.id = 'login';
        //---username---
        // login form label
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username:  ';
        // login form label input
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.autocomplete = 'username'
        usernameLabel.appendChild(usernameInput);

        form.appendChild(usernameLabel);
        document.body.appendChild(form);
    }
    render();
}

export {loginPage};