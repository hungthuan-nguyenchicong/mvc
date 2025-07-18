// ./routes.js
// import UserController from "./controllers/UserController.js";
// const userControllerInstance = new UserController();
// const routes = {
//     '/': async ()=>{
//         return new Response('Chào mừng đến với ứng dụng Bun MVC!');
//     },
//     '/users': {
//         //GET: userControllerInstance.index,
//         GET: () => new Response(userControllerInstance).index,
//     }
// }

// ./routes.js
import UserController from "./controllers/UserController";
const routes = {
    // ...
    '/users': {
        GET: UserController.index, // Here, you're directly assigning the method
    }
}
//export default routes;

//export default routes;