// web-mvc/backend/admin/models/UploadModel.js

/**
 * sudo -i -u postgres psql
 * \c mvcdb
 * \d images
 * q
 * exit
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL UNIQUE,
    alt VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
 */
import { db } from "../../core/ConnectDB"
class UploadModel {

    async create(image) {
        try {
            const result = await db`INSERT INTO images (name, url, alt) VALUES (${image.name}, ${image.url}, ${image.alt}) RETURNING *`;
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async selectAll() {
        try {
            const result = await db`SELECT id, name, url, alt FROM images`;
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async select(id) {
        try {
            const result = await db`SELECT id, name, url, alt FROM images WHERE id=${id}`;
            return result;
        } catch (error) {
            console.error(error);
            throw error
        }
    }
}

export {UploadModel}