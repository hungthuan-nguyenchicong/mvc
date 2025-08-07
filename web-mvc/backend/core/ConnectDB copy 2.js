// web-mvc/backend/core/ConnectDB.js

import { SQL } from "bun";
class ConnectDB {
    static instance = null;
    db = null;

    constructor() {
        if (ConnectDB.instance) {
            return ConnectDB.instance;
        }
        const dbConfig = {
            hostame: "localhost",
            port: 5432,
            database: "mvcdb",
            username: "cong",
            password: "Cong12345",

            // Connection poll settings
            max: 20,
            idleTimeout: 30,
            maxLifetime: 0,
            connectionTimeout: 30,

            // SSL/TLS
            tls: false,

            // onconnect: () => {
            //     //console.log("Connected to database");
            // },
            // onclose: () => {
            //     //console.log("Connection closed");
            // }
        }
        // Khởi tạo đối tượng SQL
        this.client = new SQL(dbConfig);

        ConnectDB.instance = this;
    }
    // Getter để lấy đối tượng client
    getConnection() {
        return this.client;
    }
}

const connectDB = new ConnectDB();
export { connectDB };

//use