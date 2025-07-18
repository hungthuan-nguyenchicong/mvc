// ./routes.js
import { adminControllerInstance } from "./admin/controllers/AdinController";
const routes = {
    '/admin/index': adminControllerInstance.index()
}

export default routes;