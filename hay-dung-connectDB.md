## // web-mvc/backend/core/ConnectDB.js

import { SQL } from "bun";
import 'dotenv/config'

class ConnectDB {
    static instance = null;
    db = null;

    constructor() {
        if (ConnectDB.instance) {
            return ConnectDB.instance;
        }

        const dbConfig = {
            hostame: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            database: process.env.DB_DATABASE || "mvcdb",
            username: process.env.DB_USER || "cong",
            password: process.env.DB_PASSWORD || "Cong12345",
            max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
            idleTimeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10) || 30,
            connectionTimeout: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT, 10) || 30,
            tls: process.env.DB_TLS === 'true',
        }

        this.client = new SQL(dbConfig);
        ConnectDB.instance = this;
    }

    getConnection() {
        return this.client;
    }
}

const connectDB = new ConnectDB();
const db = connectDB.getConnection();
export { db };