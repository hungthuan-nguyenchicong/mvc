import { getHomePageContent } from "./views/home.js";

function tt(t) {
    console.log(t);
}

// router

export function handleRouting(appElement) {
    const hash = window.location.hash.substring(1);
    let content = '';

    switch (hash) {
        case 'home':
            content = getHomePageContent();
            break;
        default:
            content = '';
            break;
    }
    appElement.innerHTML = content;

}