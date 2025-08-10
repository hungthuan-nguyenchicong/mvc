// web-mvc/backend/admin/models/PostModel.js

/**
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE posts
ADD CONSTRAINT unique_title UNIQUE (title);


CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


 */
import { db } from "../../core/ConnectDB"
class PostModel {
    constructor() {
        //this.posts;
    }

    async create(post) {
        try {
            const result = await db`INSERT INTO posts (title, content) VALUES (${post.title}, ${post.content}) RETURNING *`;
            //console.log(result);
            return result;

        } catch (error) {
            console.error(error);
            //return false;
            throw error;
        }
    }

    async fetchAll() {
        try {
            const result = await db`SELECT id, title, content FROM posts`;
            //console.log(result[0]);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async select(id) {
        try {
            const result = await db`SELECT id, title, content FROM posts WHERE id = ${id}`
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async update(post) {
        try {
            // Sửa cú pháp UPDATE, gán giá trị cho từng cột
            const result = await db`UPDATE posts SET title=${post.title}, content=${post.content} WHERE id=${post.id}`;
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await db`DELETE FROM posts WHERE id=${id}`;
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export {PostModel}