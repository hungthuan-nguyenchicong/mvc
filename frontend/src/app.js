// ./src/app.js
import './app.scss';
import { headerInstance } from "./parts/header";
import { mainInstance } from './parts/main';

// router
import { routerInstance } from './core/Router';


document.addEventListener('DOMContentLoaded', ()=>{
    headerInstance.init();
    mainInstance.init();

    // router
    routerInstance.init();
})