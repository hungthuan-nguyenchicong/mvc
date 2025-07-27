// web-mvc/backend/admin/core/RouterAdminApi.js

export class RouterAdminApi {
    constructor(req) {
        this.req = req;
    }

    async handle() {
        const url = new URL(this.req.url);
        // Get the full query string including the leading '?'
        const searchString = url.search; // Example: "?TestController@index&id=1&page=1"

        // Debugging:
        console.log("Full Search String:", searchString);

        // Apply regex directly to searchString, accounting for the leading '?'
        // Regex: ^\?([^@]+)@([^?&]+)(?:&(.*))?$
        //   ^      : Start of the string
        //   \?     : Match the literal '?' character
        //   ([^@]+): Capture Group 1 (Controller Name - one or more chars not '@')
        //   @      : Match the literal '@'
        //   ([^?&]+): Capture Group 2 (Method Name - one or more chars not '?' or '&')
        //   (?:    : Non-capturing group for the optional remaining parameters
        //     &    :   Match literal '&'
        //     (.*) :   Capture Group 3 (Remaining Params - zero or more of any char)
        //   )?     : Make the entire non-capturing group optional (0 or 1 time)
        //   $      : End of the string
        const match = searchString.match(/^\?([^@]+)@([^&]+)(?:&(.+))?$/);
        //const match = searchString.match(/^\?([^@]+)@([^?&]+)(?:&(.*))?$/);

        if (!match) {
            return Response.json({ error: "Định dạng query string không hợp lệ", debug: searchString }, { status: 400 });
        }

        const controllerName = match[1]; // e.g., "TestController"
        const methodName = match[2];     // e.g., "index"
        const remainingParamsString = match[3] || ''; // e.g., "id=1&page=1" or an empty string

        console.log(`Controller: ${controllerName}`);
        console.log(`Method: ${methodName}`);
        console.log(`Remaining Params String: ${remainingParamsString}`);

        // Further parse remainingParamsString using URLSearchParams for robustness
        const params = {};
        if (remainingParamsString) {
            const remainingSearchParams = new URLSearchParams(remainingParamsString);
            for (const [key, value] of remainingSearchParams.entries()) {
                params[key] = value;
            }
        }
        console.log(`Parsed Params Object:`, params);

        return new Response(`Processed: Controller=${controllerName}, Method=${methodName}, Params=${JSON.stringify(params)}`);
    }
}