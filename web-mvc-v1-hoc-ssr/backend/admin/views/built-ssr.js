// web-mvc/backend/admin/views/built-ssr.js

import { loginPage } from "./login/login-page";
function testBuilt(){
    return loginPage().render()
}

export {testBuilt};