// ./src/app.js
import './app.scss';
import { headerInstance } from "./parts/header";
import { mainInstance } from './parts/main';


document.addEventListener('DOMContentLoaded', ()=>{
    headerInstance.init();
    mainInstance.init();
})