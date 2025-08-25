// web-mvc/backend/admin/models/ProductModel.js
/**
CREATE TABLE products (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
price NUMERIC(10),
stock_quantity INTEGER NOT NULL,
category_id INTEGER REFERENCES categories(category_id)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  featured VARCHAR(255),
  description TEXT,
  price INTEGER,
  create_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INTEGER (4 byte): Phạm vi giá trị từ -2,147,483,648 đến 2,147,483,647. Kiểu này đủ cho hầu hết các sản phẩm thông thường.
BIGINT (8 byte): Phạm vi giá trị từ -9,223,372,036,854,775,808 đến 9,223,372,036,854,775,807. Đây là lựa chọn an toàn nhất nếu bạn cần lưu giá trị cực lớn, chẳng hạn như giá trị của một bất động sản hoặc một dự án lớn.

 */

import { db } from "../../core/ConnectDB";
class ProductModel {

    async create(product) {
        try {
            const result = await db`INSERT INTO products (title, slug, featured, description, price) VALUES (${product.title}, ${product.slug}, ${product.featured}, ${product.description}, ${product.price}) RETURNING *`;
            return result;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}

export {ProductModel}