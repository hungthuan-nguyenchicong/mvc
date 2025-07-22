// ./project/views/admin

export class Login {

    render() {
        return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            <script type="module" src="public/admin-dist/login-main.js"></script>
            (isDev)
        </body>
        </html>
        `;
    }
}