import { handleRouting } from "./router.js";

const app = document.getElementById('app');
window.addEventListener('hashchange', ()=> handleRouting(app));
