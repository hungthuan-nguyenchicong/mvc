import {serve} from "bun";
import index from './index.html';

const sever = serve({
    //const body = document.querySelector('body')
    routes: {
        "/": index,
        '/api/hello': {GET:()=> Response.json({
            message:"Hello from API"
        })}
    }
})