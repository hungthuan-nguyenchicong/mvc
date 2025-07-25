// web-mvc/backend/admin/core/RouterAdminApi.js

export class RouterAdminApi {
    constructor(req) {
        this.req = req;
    }

    async handle() {
        const url = new URL(this.req.url);

        // Get the raw query string (e.g., "?TestController@index&id=1")
        // Then remove the leading '?'
        const rawQueryString = url.search.substring(1);

        // Debugging:
        console.log("Raw Query String:", rawQueryString); // This will be "TestController@index&id=1"

        // Your regex should now work against rawQueryString
        const match = rawQueryString.match(/^([^@]+)@([^?&]+)(?:&(.*))?$/);

        if (!match) {
            return Response.json({ error: "Định dạng query string không hợp lệ", debug: rawQueryString }, { status: 400 });
        }

        const controllerName = match[1];
        const methodName = match[2];
        const remainingParams = match[3] || '';

        console.log(`Controller: ${controllerName}`);
        console.log(`Method: ${methodName}`);
        console.log(`Remaining Params: ${remainingParams}`);

        return new Response(`Processed: Controller=${controllerName}, Method=${methodName}, Params=${remainingParams}`);
    }
}