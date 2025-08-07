## sử dụng một thư viện như dotenv
require('dotenv').config();

// Sử dụng process.env để lấy giá trị từ .env
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
  // Khai báo pool settings từ các biến môi trường
  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
    idleTimeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10) || 30,
    maxLifetime: parseInt(process.env.DB_POOL_MAX_LIFETIME, 10) || 0,
    connectionTimeout: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT, 10) || 30,
  },
};

// Bây giờ, bạn có thể sử dụng dbConfig để khởi tạo kết nối cơ sở dữ liệu
// Ví dụ: với pg-promise
// const pgp = require('pg-promise')();
// const db = pgp(dbConfig);