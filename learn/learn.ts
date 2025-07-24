import {serve} from "bun";
import index from './index.html';
// import dashboard from './dashboard.html';
import dashboard from './src/public/dashboard.html';

//import { App } from "./app";

//document.addEventListener()
if (import.meta.hot) {
  import.meta.hot.accept();
}
const sever = serve({
    //const body = document.querySelector('body')
    routes: {
        "/": index,
        "/dashboard": dashboard,
        // '/api/hello': {GET:()=> Response.json({
        //     message:"Hello from API"
        // })},
        // "/api/users": {
        //     async GET(req) {
        //         cosnt users = await 
        //     }
        // }

        // fetch(req) {

        // },
    },

    fetch (req) {
        return new Response('hello');
    },
    
})