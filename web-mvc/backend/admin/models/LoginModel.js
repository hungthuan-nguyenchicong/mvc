// web-mvc/backend/admin/models/LoginModel.js
// import { connectDB } from "../../core/ConnectDB";
// const db = connectDB.client;
// console.log(db)
import { db } from "../../core/ConnectDB";
// class LoginModel {
//     #username;
//     #password;
//     #users;
//     //#usersPromise;
//     constructor() {
//         //this.#username = this.#users[0].username;
//         //this.#password = this.#users[0].password_hash;
//         //this.#username = 'admin';
//         //this.#password = '$2b$10$hF7/7EPjManGxd16YuCM5eJsyUNKjWodsmZyYwGkJ7H7YIAZuLfH6';
//         //this.#users = this.getUsers();
//         //console.log(this.getUsers())
//     }
//     async getUsers() {
//         try {
//             this.#users = await db`SELECT * FROM users`;
//             //console.log(this.#users)
//             return this.#users;
//         } catch (error) {
//             console.error(error);
//             return false;
//         }

//     }
//     async validate(username, password) {
//         //console.log(await this.getUsers())
//         this.#users = await this.getUsers();
//         this.#username = this.#users[0].username;
//         this.#password = this.#users[0].password_hash;
//         //console.log(this.#password)
//         if (this.#username !== username) {
//             return false;
//         }
//         // Sử dụng Bun.password.verify() để xác thực mật khẩu
//         try {
//             return await Bun.password.verify(password, this.#password);
//         } catch(error) {
//             console.error("Error during password verification:", error);
//             return false;
//         }
//     }
// }

class LoginModel {
    /**
     * Validates a user's credentials against the database.
     * @param {string} username - The username to validate.
     * @param {string} password - The password to verify.
     * @returns {Promise<boolean>} True if credentials are valid, false otherwise.
     */
    async validate(username, password) {
        try {
            // Fetch only the user that matches the provided username
            const users = await db`SELECT password_hash FROM users WHERE username = ${username} LIMIT 1`;
            const user = users[0];

            // If no user is found, authentication fails
            if (!user) {
                return false;
            }
            
            // Verify the provided password against the stored hash
            return await Bun.password.verify(password, user.password_hash);
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

/**
UPDATE users
SET password_hash = '$2b$10$hF7/7EPjManGxd16YuCM5eJsyUNKjWodsmZyYwGkJ7H7YIAZuLfH6'
WHERE username = 'admin';
 */

export {LoginModel}