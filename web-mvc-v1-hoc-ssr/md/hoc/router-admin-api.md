## Admin Api Router

// web-mvc/backend/admin/core/RouterAdminApi.js

export class RouterAdminApi {
    constructor(req) {
        this.req = req;
    }

    async handle() {
        const url = new URL(this.req.url);
        const searchString = url.search;

        const match = searchString.match(/^\?([^@]+)@([^&]+)(?:&(.+))?$/);

        if (!match) {
            return Response.json({error: 'Đinh dạng query string không phù hợp'},{status:400});
        }
        const [,controllerName, action, paramString] = match;
        // --- BẮT ĐẦU PHÂN TÍCH paramString ---
        // Chuyển searchParams thành object để truyền vào controller
        const params = {}
        if (paramString) {
            // Tạo một URLSearchParams mới từ chuỗi remainingParamsString
            // Cách này an toàn và xử lý URL decoding tự động
            const searchParams = new URLSearchParams(paramString || '');
            // Duyệt qua các tham số và lưu vào đối tượng 'params'
            for (const [key, value] of searchParams) {
                params[key] = value;
            }
        }
        // Kiểm tra file controller tồn tại
        const controllerFile = Bun.file(`./backend/admin/controllers/${controllerName}.js`);
        if (!(await controllerFile.exists())) {
            return Response.json({error: `không tìm thấy ${controllerFile}`}, {status:404});
        }
        // Tải controller động
        
        try {
            const controllerModule = await import(`../controllers/${controllerName}.js`);
            const Controller = controllerModule[controllerName] || controllerModule.default;

            if (!Controller) {
                return Response.json(
                    { error: `Không tìm thấy controller ${controllerName}` },
                    { status: 404 }
                );
            }
            // Khởi tạo controller với req
            const controllerInstance = new Controller(this.req);
            // Kiểm tra hành động
            if (!controllerInstance[action]) {
                return Response.json(
                    { error: `Không tìm thấy hành động ${action} trong ${controllerName}` },
                    { status: 404 }
                );
            }
            // Thực thi hành động với tất cả tham số
            return await controllerInstance[action](params);
        } catch (error) {
            console.error(error);
            return Response.json(
                { error: `Lỗi khi tải controller ${controllerName}: ${error.message}` },
                { status: 500 }
            );
        }

        // console.log(controllerFile)
        // return new Response(`echo: ${params}`)
    }
}

## tham khảo

query string (ví dụ: `/admin/api/?PostController@index`).

static async handle(req) {
    const url = new URL(req.url);
    const searchString = url.search;


// Phân tích query string bằng regex
    const match = searchString.match(/^\?([^@]+)@([^&]+)(?:&(.+))?$/);
        //const match = searchString.match(/^\?([^@]+)@([^?&]+)(?:&(.*))?$/);
    // cách 1
    const [, controllerName, action, params] = match;
    const searchParams = new URLSearchParams(params || "");

    // cách 2 hoặc có thể

    const controllerName = match[1]; // e.g., "TestController"
        const methodName = match[2];     // e.g., "index"
        const remainingParamsString = match[3] || ''; // e.g., "id=1&page=1" or an empty string

    // --- BẮT ĐẦU PHÂN TÍCH paramString ---
        if (paramString) {
            // Tạo một URLSearchParams mới từ chuỗi remainingParamsString
            // Cách này an toàn và xử lý URL decoding tự động
            const searchParams = new URLSearchParams(paramString || '');
            // lắp các đối tượng trả về đối tượng đơn
            const params = {}
            // Duyệt qua các tham số và lưu vào đối tượng 'params'
            for (const [key, value] of searchParams) {
                params[key] = value
            }
        }
        console.log(params)
        return new Response(`echo: ${params.id}`)

## tham khảo cách viêt 2

// Example using standard query parameters
// For URL: http://localhost:3000/admin/api/?controller=TestController&method=index&id=1
export class RouterAdminApi {
    constructor(req) {
        this.req = req;
    }

    async handle() {
        const url = new URL(this.req.url);

        const controllerName = url.searchParams.get('controller');
        const methodName = url.searchParams.get('method');
        const id = url.searchParams.get('id');

        if (!controllerName || !methodName) {
            return Response.json({ error: "Thiếu tham số controller hoặc method", debug: url.searchParams.toString() }, { status: 400 });
        }

        console.log(`Controller: ${controllerName}`);
        console.log(`Method: ${methodName}`);
        console.log(`ID: ${id}`);

        // ... logic to dynamically import and call controller methods ...

        return new Response(`Processed (standard params): Controller=${controllerName}, Method=${methodName}, ID=${id || 'none'}`);
    }
}