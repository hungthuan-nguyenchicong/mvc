// web-mvc/backend/core/CookieManager.js

class CookieManager {
    #requestHeader;
    #newCookies = [];

    constructor(requestHeaders) {
        this.#requestHeader = requestHeaders;
    }

    // Now, this method *uses* #requestHeader
    get(name) {
        const cookieHeader = this.#requestHeader.get('Cookie');
        if (!cookieHeader) {
            return undefined;
        }

        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return value;
            }
        }
        return undefined;
    }

    /**
   * Phương thức set() để thiết lập cookie mới cho response
   */

    set(name, value, options = {}) {
        let cookiesString = `${name}=${value}`;

        if (options.maxAge) {
            cookiesString += `; Max-Age=${options.maxAge}`;
        }

        if (options.path) {
            cookiesString += `; Path=${options.path}`;
        }

        if (options.httpOnly) {
            cookiesString += `; HttpOnly`;
        }

        if (options.secure) {
            cookiesString += `; Secure`;
        }
        // Lưu chuỗi cookie để sau đó thêm vào header 'Set-Cookie' của response
        this.#newCookies.push(cookiesString);
    }

    // Thêm phương thức delete vào đây
    delete(name, options = {}) {
        this.set(name, '', { ...options, maxAge: 0 });
    }

    /**
   * Phương thức để lấy các chuỗi Set-Cookie đã được tạo
   * Phương thức này sẽ được gọi khi bạn gửi response
   */

    getSetCookieHeaders() {
        return this.#newCookies;
    }
}

export {CookieManager}