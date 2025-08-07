// web-mvc/backend/admin/models/testConnection.js
import { conDB } from "../../core/ConnectDB";
const sql = conDB;
async function testConnection() {
  try {
    // Thực hiện truy vấn trực tiếp trên đối tượng client đã được khởi tạo
    await sql`SELECT 1`; // Cú pháp Tagged Template Literals của Bun SQL
    console.log("Database connection successful!");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export {testConnection}