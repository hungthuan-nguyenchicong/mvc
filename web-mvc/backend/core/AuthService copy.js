// web-mvc/backend/core/AuthService.js
import { CookieManager } from "./CookieManager";

class AuthService {
    #req;

    constructor(req) {
        this.#req = req;
    }

    async checkAuth() {
        const cookieManagerInstance = new CookieManager(this.#req.headers);
        const sessionToken = cookieManagerInstance.get('session_token');

        // Note: The original code used a single '&' which is a bitwise AND.
        // I've corrected it to '&&' for a logical AND.
        if (sessionToken && sessionToken.length > 0) {
            // In a real application, you would perform a database or cache lookup here
            // to validate the session token. For now, checking for its existence is fine.
            return true;
        }
        return false;
    }
}

export { AuthService };

// web-mvc/backend/core/AuthService.js
// import { CookieManager } from "./CookieManager";
// class AuthService {
//     constructor(req) {
//         const cookieManagerInstance = new CookieManager(req.headers);
//         const sessionToken = cookieManagerInstance.get('session_token');

//         if (sessionToken & sessionToken.length >0) {
//             return true;
//         }
//         return false;
//     }
// }

// export {AuthService}