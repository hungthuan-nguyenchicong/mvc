// web-mvc/backend/admin/controllers/PostController.js
import { PostModel } from "../models/PostModel";
class PostController {
    constructor(req) {
        this.req = req;
        this.title;
        this.content;
        //this.posts;
        this.postModel = new PostModel();
    }
    index() {
        return this.fetchAll();
    }

    async create() {
        if (this.req.method === "POST") {
            try {
                const formData = await this.req.formData();
                //console.log(formData)
                this.title = formData.get('title');
                this.content = formData.get('content');
                //console.log(this.content)
                // this.posts = [
                //     this.title, this.content
                // ];
                const newPost = {
                    title: this.title,
                    content: this.content,
                }
                //console.log(this.posts)
                await this.postModel.create(newPost);
                return Response.json({message: 'success'}, {status:201});
            } catch (error) {
                console.error(error);
                return Response.json({message:'failed'}, {status:500});
            }
            //return Response.json({create:'ok'}, {status:200});
        } else {
            return Response.json(null,{status:405});
        }
    }

    async fetchAll() {
        try {
            const result = await this.postModel.fetchAll();
            return Response.json({posts:result}, {status:201});
        } catch (error) {
            console.error(error);
            return Response.json({error:error}, {status:500});
        }
    }

    async select(params = {}) {
        const {id = 1} = params;
        try {
            const result = await this.postModel.select(id);
            return Response.json({posts:result}, {status:201});
        } catch (error) {
            console.log(error);
            return Response.json({error:error}, {status:500})
        }
    }
}

export {PostController}