// web-mvc/backend/admin/controllers/PostController.js

class PostController {
    constructor(req) {
        this.req = req;
    }
    index() {
        return Response.json({post:'ok'}, {status:200});
    }

    create() {
        if (this.req.method === "POST") {
            return Response.json({create:'ok'}, {status:200});
        } else {
            return Response.json(null,{status:405})
        }
    }
}

export {PostController}