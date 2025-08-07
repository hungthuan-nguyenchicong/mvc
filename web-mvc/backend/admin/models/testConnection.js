// web-mvc/backend/admin/models/testConnection.js
//import { conDB } from "../../core/ConnectDB";
//const sql = conDB;
//import { sql } from "../../core/ConnectDB";
//import { sql } from "bun";
import { db } from "../../core/ConnectDB";
async function testConnection() {
  try {
    // Thực hiện truy vấn trực tiếp trên đối tượng client đã được khởi tạo
    // await sql`SELECT 1`; // Cú pháp Tagged Template Literals của Bun SQL
    // console.log("Database connection successful!");
    // return true;
    const user = await db`SELECT * FROM users`;
    console.log(user);
    console.log(user[0].username)
    console.log(user[0].password_hash)
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export {testConnection}