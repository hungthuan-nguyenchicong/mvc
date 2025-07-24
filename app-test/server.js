// ./server.js
import index from './src/pages/index.html';
import login from './src/pages/login.html';
import renderPageTest from './src/pages/test';

if (import.meta.hot) {
  // HMR APIs are available.
  import.meta.hot.accept()
}
const server = Bun.serve({
    // development can also be an object.
    development: {
        // Enable Hot Module Reloading
        hmr: true,

        // Echo console logs from the browser to the terminal
        console: true,
    },

    routes: {
        '/': index,
        '/login': login,
        '/test': renderPageTest,
        '/src/*': async req => {
            const filePath = new URL(req.url).pathname;
            //console.log(filePath);
            const file = Bun.file('.' + filePath);
            if (await file.exists()) {
                return new Response( await file.stream());
            }
            return new Response('Not Found', {status: 404})
        }
    }
})

//console.log(import.meta.url);
//console.log(filePath);