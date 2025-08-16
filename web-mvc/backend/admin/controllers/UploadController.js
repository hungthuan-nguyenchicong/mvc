// web-mvc/backend/admin/controllers web-mvc/backend/admin/controllers/UploadController.js
import { UploadModel } from "../models/UploadModel";
class UploadController {
    constructor(req) {
        this.req = req;
        this.uploadModelInstance = new UploadModel();
    }
    async index() {
        try {
            const images = await this.uploadModelInstance.selectAll();
            return Response.json({success:201,
                images:images,
            }, {status:201});
        } catch (error) {
            console.error(error);
            return Response.json({error:'500',
                message: error,
            }, {status:500});
        }
    }

    async create() {
        if (this.req.method === "POST") {
            try {
                
                const formData = await this.req.formData();
                const file = formData.get('file');
                const alt = formData.get('alt');
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
                const url = `/uploads/${file.name}`;

                
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
                
                // ghi vào csdl
                try {
                    const image = {
                        name: file.name,
                        url: url,
                        alt: alt,
                    }
                    await this.uploadModelInstance.create(image);
                    await Bun.write(filePathOnServer, file);
                    // Kiểm tra xem tệp đã tồn tại chưa
                    //await Bun.write(filePathOnServer, file);
                    
                    // Đây là đường dẫn công khai (URL) mà trình duyệt có thể truy cập
                    //const publicUrl = `/uploads/${file.name}`;
                    return Response.json({ success: '201',
                        message: 'Thành công tạo ảnh'
                    }, {status:201}); // Trả về đường dẫn công khai
                    
                } catch (error) {
                    console.error(error);
                    // Use 500 for internal server errors
                    return Response.json({error:'500',
                        message: error,
                    }, {status:500});
                }
            } catch (error) {
                console.error(error);
                return Response.json({error:error}, {status:500});
            }

        }
        return Response.json({error: '405',
            message: 'Method Post'
        }, {status: 405});
    }

    async edit(params = {}) {
        //console.log()
        const {id = null} = params;
        try {
            const image = await this.uploadModelInstance.select(id);
            return Response.json({success: '201',
                image: image,
            }, {status:201})
        } catch (error) {
            console.error(error);
            return Response.json({error:'500',
                message: error,
            }, {status:500})
        }
    }
}

export {UploadController}