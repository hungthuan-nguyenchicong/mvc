// web-mvc/backend/core/AdminApi.js

class AdminApi {
    constructor() {
        //this.req = req;
    }

    async handle(req) {
        const url = new URL(req.url);
        const searchString = url.search;
        //console.log(searchString);

        const match = searchString.match(/^\?([^@]+)@([^&]+)(?:&(.+))?$/);
        if (!match) {
            return Response.json({error: 'Đinh dạng query string không phù hợp'}, {status:400});
        }
        //console.log(match)
        const [, controllerName, action, paramString] = match;
        //console.log(paramString);
        //console.log(req)
        const params = {};
        if (paramString) {
            const searchParams = new URLSearchParams(paramString);
            //console.log(searchParams)
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
            //console.log(params)
        }

        const controllerFile = `../admin/controllers/${controllerName}.js`;
        if (controllerFile) {
            const module = await import(controllerFile);
            //console.log(module);
            const moduleInstance = new module[controllerName];
            console.log(moduleInstance);
            return moduleInstance[action](params);
        }
        //return Response.json({ok:'api'});
    }
}

export {AdminApi}