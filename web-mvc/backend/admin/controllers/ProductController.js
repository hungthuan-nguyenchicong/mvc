// web-mvc/backend/admin/controllers/ProductController.js

class ProductController {
    constructor(req) {
        this.req = req
    }

    async create() {
        if (this.req.method === "POST") {
            try {
                const formData = await this.req.formData();
                console.log(formData);
                return Response.json({data:formData}, {status:201});
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