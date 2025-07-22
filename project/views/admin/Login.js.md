## /project/views/admin/Login.js

// ./project/views/admin/Login.js

// You might need to pass this into the render method or make it globally available
// For simplicity, let's assume you're in a Vite context where import.meta.env is available.
// If this file is not directly processed by Vite, you'll need another mechanism
// to inject the 'isDev' variable (e.g., from your backend if it's templating).

export class Login {
    render() {
        // Determine if it's development mode
        // In a Vite processed file, import.meta.env.DEV is true in dev, false in build
        const isDev = import.meta.env.DEV; 

        // Choose the base URL for the script
        const scriptBaseUrl = isDev ? 'http://localhost:5173/' : '/'; // Or whatever your production base path is
        const scriptPath = 'admin-dist/login-main.js'; // The path relative to publicDir or outDir

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
            <script type="module" src="${scriptBaseUrl}${scriptPath}"></script>
        </body>
        </html>
        `;
    }
}

## Nếu Login.jsVite không xử lý thì sao?

// In your backend (e.g., Node.js Express route)
const isDevelopment = process.env.NODE_ENV === 'development'; // Or similar
const loginPageHtml = new Login().render(isDevelopment); // Pass it in

// ./project/views/admin/Login.js
export class Login {
    render(isDev) { // Accept isDev as a parameter
        const scriptBaseUrl = isDev ? 'http://localhost:5173/' : '/';
        const scriptPath = 'admin-dist/login-main.js';

        return /* html */ `
            <script type="module" src="${scriptBaseUrl}${scriptPath}"></script>
            `;
    }
}