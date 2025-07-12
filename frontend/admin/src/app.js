// ./src/app.js
import './app.scss';
import { headerInstance } from "./parts/header";
import { mainInstance } from './parts/main';

// router
import { routerInstance } from './core/router';

// error page 401
//import { errorPageInstance } from './utils/error-page';


document.addEventListener('DOMContentLoaded', ()=>{
    headerInstance.init();
    mainInstance.init();

    // router
    routerInstance.init();
    // error page
    //errorPageInstance;
})