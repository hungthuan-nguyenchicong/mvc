// web-mvc/backend/admin/controllers web-mvc/backend/admin/controllers/UploadController.js

class UploadController {
    index() {
        return new Response('upload-index')
    }

    async post(req) {
        if (req.method === "POST") {

            const formData = await req.formData();
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
            const publicUrl = `/uploads/${file.name}`;
            
            return Response.json({ src: publicUrl }); // Trả về đường dẫn công khai
        }
        return Response.json(null, {status: 405});
    }

}

export {UploadController}