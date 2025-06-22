// js/router.js
export class Router {
    
    constructor(routes) {
        this.routes = routes || [];

    }

    async router() {
        console.log(this.routes);
    }
}

const appRoutes = [
    {path: '/', view: 'index'},
    {path: '/home', view: 'home'},
];

export {appRoutes};