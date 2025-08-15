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
                    // code 400 Bad Request
                    return Response.json({error: '400', 
                        message: 'Vui lòng chọn file hình ảnh',
                    }, {status: 400});
                }
                console.log(file)
                // const file path
                // Đây là đường dẫn tệp tin trên hệ thống (server)
                const filePathOnServer = `./uploads/${file.name}`;
                // Kiểm tra xem tệp đã tồn tại chưa
                // Sử dụng Bun.file().exists() hoặc fs.promises.access
                const fileExists = await Bun.file(filePathOnServer).exists();
                // const fileExists = await fs.access(filePathOnServer).then(() => true).catch(() => false); // Cách thay thế

                if (fileExists) {
                    // Nếu tệp đã tồn tại, bạn có thể trả về một phản hồi lỗi
                    // 409 Conflict -> đã tồn tại
                    return Response.json({error: '409',
                        message: 'Hình Ảnh đã tồn tại',
                     }, { status: 409 });
                }
                
                await Bun.write(filePathOnServer, file);
    
                // Đây là đường dẫn công khai (URL) mà trình duyệt có thể truy cập
                //const publicUrl = `/uploads/${file.name}`;
                
                return Response.json({ success: '201',
                    message: 'Thành công tạo ảnh'
                }, {status:201}); // Trả về đường dẫn công khai
            } catch (error) {
                console.error(error);
                return Response.json({error:error}, {status:500});
            }

        }
        return Response.json({error: '405',
            message: 'Method Post'
        }, {status: 405});
    }

}

export {UploadController}