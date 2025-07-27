// web-mvc/backend/admin/controllers/LoginController.js
//import {loginPage} from '../views/login/login-page'
//import { loginPage } from "../../../out/login-page"
import { loginPage } from "../../../dist/server/login-page";

//import { testBuilt } from "../views/built-ssr";
//import { testBuilt } from "../../../dist/server/built-ssr"
export class LoginController {

    async index() {
        // Bước 1: Gọi hàm loginPage() để lấy đối tượng mà nó trả về
        //const pageModule = loginPage(); // pageModule bây giờ là {render: [Function: render]}

        // Bước 2: Truy cập thuộc tính render từ đối tượng đó
        return new Response(loginPage().render(),{headers:{'Content-Type':'text/html'}});
        //return new Response(testBuilt(),{headers:{'Content-Type':'text/html'}})

    }
}