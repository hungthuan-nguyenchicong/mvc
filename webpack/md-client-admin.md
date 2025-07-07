## học

You're looking to configure Webpack to serve different bundles for different paths: the root path (/) for your client application and /admin/ for your admin panel. This is a common setup, especially for single-page applications (SPAs) where you might have separate entry points for different parts of your site.

To achieve this, you'll need two separate Webpack configurations, or a single configuration that can handle both scenarios (which can get complex). For clarity and maintainability, having two separate Webpack configuration files is generally the recommended approach.

Here's how you can structure your project and Webpack configurations:

Project Structure
First, let's define a logical project structure:

your-project/
├── public/
│   ├── client/           // For client-side bundles (served from /)
│   └── admin/            // For admin-side bundles (served from /admin/)
├── client/
│   ├── src/
│   │   ├── app.js
│   │   └── index.html
│   └── webpack.config.js // Webpack config for client
├── admin/
│   ├── src/
│   │   ├── app.js
│   │   └── index.html
│   └── webpack.config.js // Webpack config for admin
├── package.json
└── ...
Webpack Configuration for Client (client/webpack.config.js)
This configuration will handle your client-side application, typically served from the root path (/).

JavaScript

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './client/src/app.js', // Entry point for your client app
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, '../public/client'), // Output to public/client
            clean: true,
            publicPath: '/', // Public path for assets on the client side
        },
        module: {
            rules: [
                {
                    test: /\.(ico|png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext][query]',
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './client/src/index.html',
                favicon: './client/src/favicon.ico',
                filename: 'index.html',
                inject: 'body',
                scriptLoading: 'module',
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? 'style.[contenthash].css' : 'style.css',
            }),
        ],
        devServer: {
            hot: true,
            static: {
                directory: path.join(__dirname, '../public/client'), // Serve client assets
                publicPath: '/',
            },
            compress: true,
            port: 8080, // Different port for client dev server
            open: {
                app: {
                    name: 'chrome',
                },
            },
            historyApiFallback: true,
        },
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};
Webpack Configuration for Admin (admin/webpack.config.js)
This configuration will handle your admin application, which you want to serve from /admin/.

JavaScript

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './admin/src/app.js', // Entry point for your admin app
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, '../public/admin'), // Output to public/admin
            clean: true,
            // Crucial: Set publicPath to match the base path you'll serve admin from
            publicPath: '/admin/',
        },
        module: {
            rules: [
                {
                    test: /\.(ico|png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext][query]',
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './admin/src/index.html',
                favicon: './admin/src/favicon.ico',
                filename: 'index.html',
                inject: 'body',
                scriptLoading: 'module',
            }),
            new MiniCssExtractPlugin({
                filename: isProduction ? 'style.[contenthash].css' : 'style.css',
            }),
        ],
        devServer: {
            hot: true,
            static: {
                // Serve from the public/admin directory
                directory: path.join(__dirname, '../public/admin'),
                // Make sure the publicPath for dev server also matches /admin/
                publicPath: '/admin/',
            },
            compress: true,
            port: 9000, // Different port for admin dev server
            open: {
                app: {
                    name: 'chrome',
                },
            },
            // For admin SPA, redirect unknown paths within /admin/ to index.html
            historyApiFallback: {
                rewrites: [
                    {
                        from: /^\/admin\/.*$/,
                        to: '/admin/index.html',
                    },
                ],
            },
        },
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};
Key Changes and Explanations
Separate Configuration Files: We now have client/webpack.config.js and admin/webpack.config.js. This makes each configuration cleaner and easier to manage.

Output Path (output.path):

Client: path.resolve(__dirname, '../public/client') - Bundles will go into public/client.

Admin: path.resolve(__dirname, '../public/admin') - Bundles will go into public/admin.

Public Path (output.publicPath): This is crucial for correctly referencing assets.

Client: publicPath: '/' - This tells Webpack that all assets (like bundle.js, style.css, images) are accessible from the root of your domain. So, bundle.js will be at /bundle.js.

Admin: publicPath: '/admin/' - This tells Webpack that all admin assets are accessible under the /admin/ path. So, bundle.js for admin will be at /admin/bundle.js.

HtmlWebpackPlugin filename and template:

Ensure each HtmlWebpackPlugin references its respective index.html template and outputs to index.html within its dedicated output directory.

devServer.static:

Client: directory: path.join(__dirname, '../public/client') and publicPath: '/'. This means the client dev server will serve files from public/client and map them to the root URL.

Admin: directory: path.join(__dirname, '../public/admin') and publicPath: '/admin/'. This means the admin dev server will serve files from public/admin and map them to the /admin/ URL.

devServer.port: Use different ports for each development server (e.g., 8080 for client, 9000 for admin) to run them simultaneously.

devServer.historyApiFallback for Admin: The historyApiFallback for the admin configuration needs a rewrites rule. This ensures that if you navigate directly to, say, /admin/dashboard, the index.html file within the admin bundle (/public/admin/index.html) is served, allowing your client-side routing to take over.

Running Your Webpack Builds
You'll need separate scripts in your package.json to run these configurations:

JSON

{
  "name": "your-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build:client": "webpack --config client/webpack.config.js --mode production",
    "build:admin": "webpack --config admin/webpack.config.js --mode production",
    "start:client": "webpack serve --config client/webpack.config.js --mode development",
    "start:admin": "webpack serve --config admin/webpack.config.js --mode development"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "css-loader": "^6.x.x",
    "html-webpack-plugin": "^5.x.x",
    "mini-css-extract-plugin": "^2.x.x",
    "sass": "^1.x.x",
    "sass-loader": "^13.x.x",
    "style-loader": "^3.x.x",
    "webpack": "^5.x.x",
    "webpack-cli": "^5.x.x",
    "webpack-dev-server": "^4.x.x"
  }
}

Now you can run:

npm run start:client to develop your client app (accessible at http://localhost:8080).

npm run start:admin to develop your admin app (accessible at http://localhost:9000/admin/).

npm run build:client to build the production client assets.

npm run build:admin to build the production admin assets.

Server-Side Setup (Important for Production)
For production, your backend server (e.g., Node.js with Express, Nginx, Apache) needs to be configured to serve these different bundles based on the URL path:

Requests to / (and any sub-paths not matching /admin/): Serve public/client/index.html and static assets from public/client/.

Requests to /admin/ (and any sub-paths under /admin/): Serve public/admin/index.html and static assets from public/admin/.

Here's a simplified example using Express.js:

JavaScript

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files for the client app from /public/client
app.use(express.static(path.join(__dirname, 'public/client')));

// Serve static files for the admin app from /public/admin under the /admin/ path
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// For the client-side SPA, send index.html for any unmatched routes
app.get('*', (req, res, next) => {
    // If the request path starts with /admin, let the admin SPA handle it
    if (req.path.startsWith('/admin')) {
        res.sendFile(path.join(__dirname, 'public/admin/index.html'));
    } else {
        // Otherwise, send the client's index.html
        res.sendFile(path.join(__dirname, 'public/client/index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
This dual configuration approach provides clear separation and simplifies maintenance for each part of your application.