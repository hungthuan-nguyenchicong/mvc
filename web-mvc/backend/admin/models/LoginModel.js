// web-mvc/backend/admin/models/LoginModel.js

class LoginModel {
    #username;
    #password;
    constructor() {
        this.#username = 'admin';
        this.#password = '$2b$10$hF7/7EPjManGxd16YuCM5eJsyUNKjWodsmZyYwGkJ7H7YIAZuLfH6'
    }
    async validate(username, password) {
        if (this.#username !== username) {
            return false;
        }
        // Sử dụng Bun.password.verify() để xác thực mật khẩu
        try {
            return await Bun.password.verify(password, this.#password);
        } catch(error) {
            console.error("Error during password verification:", error);
            return false;
        }
    }
}

// use bcrypt
// const password = '123'
// const bcryptHash = await Bun.password.hash(password, {
//   algorithm: "bcrypt",
//   cost: 10, // number between 4-31
// });
// console.log(bcryptHash)

export {LoginModel}