// web-mvc/backend/admin/controllers web-mvc/backend/admin/controllers/UploadController.js

class UploadController {
    constructor(req) {
        this.req = req;
    }
    index() {
        return new Response('upload-index')
    }

    async create() {
        if (this.req.method === "POST") {
            try {
                
                const formData = await this.req.formData();
                const file = formData.get('file');
                if (!file || file.size === 0) {
                    return Response.json({message: 'no file'}, {status: 400});
                }
                console.log(file)
                // const file path
                // Đây là đường dẫn tệp tin trên hệ thống (server)
                const filePathOnServer = `./uploads/${file.name}`;
                await Bun.write(filePathOnServer, file);
    
                // Đây là đường dẫn công khai (URL) mà trình duyệt có thể truy cập
                //const publicUrl = `/uploads/${file.name}`;
                
                return Response.json({ message: 'success'}, {status:201}); // Trả về đường dẫn công khai
            } catch (error) {
                console.error(error);
                return Response.json({error:error}, {status:500});
            }

        }
        return Response.json(null, {status: 405});
    }

}

export {UploadController}