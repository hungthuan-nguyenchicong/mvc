// web-mvc/backend/core/ConnectDB.js
import { SQL } from "bun";

class ConnectDB {
  static instance = null;
  client = null;

  constructor() {
    if (ConnectDB.instance) {
      return ConnectDB.instance;
    }

    // Sử dụng cấu hình chi tiết
    const dbConfig = {
      hostname: "localhost",
      port: 5432,
      database: "mvcdb",
      username: "cong",
      password: "Cong12345",

      // Connection pool settings
      max: 20,
      idleTimeout: 30,
      maxLifetime: 0,
      connectionTimeout: 30,

      // SSL/TLS options
      tls: false,

      onconnect: (client) => {
        console.log("Connected to database");
      },
      onclose: (client) => {
        console.log("Connection closed");
      },
    };

    // Khởi tạo đối tượng SQL
    this.client = new SQL(dbConfig);

    ConnectDB.instance = this;
  }

  // Phương thức để lấy client
  getConnection() {
    return this.client;
  }

  // Phương thức mới để kiểm tra kết nối
  async testConnection() {
    try {
      // Thực hiện truy vấn trực tiếp trên đối tượng client đã được khởi tạo
      await this.client`SELECT 1`; // Cú pháp Tagged Template Literals của Bun SQL
      console.log("Database connection successful!");
      return true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return false;
    }
  }
}

const connectDB = new ConnectDB();
export { connectDB };