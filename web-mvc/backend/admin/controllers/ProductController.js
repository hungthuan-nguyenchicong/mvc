// web-mvc/backend/admin/controllers/ProductController.js
import { ProductModel } from "../models/ProductModel";
class ProductController {
    constructor(req) {
        this.req = req
        this.productModel = new ProductModel();
    }

    async create() {
        if (this.req.method === "POST") {
            try {
                const formData = await this.req.formData();
                //console.log(formData);
                const title = formData.get('title');
                const slug = formData.get('slug');
                const featured = formData.get('featured');
                const description = formData.get('description');
                const price = formData.get('price');

                const newProduct = {
                    title: title,
                    slug: slug,
                    featured: featured,
                    description: description,
                    price: price,
                }
                await this.productModel.create(newProduct);
                return Response.json({success:201}, {status:201});
            } catch (e) {
                console.error(e);
                return Response.json({error:e}, {status:500});
            }

        } else {
            return Response.json(null, {status:405});
        }
    }
}

export {ProductController}