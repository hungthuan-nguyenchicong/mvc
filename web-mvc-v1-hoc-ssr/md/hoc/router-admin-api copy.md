## Admin Api Router

query string (ví dụ: `/admin/api/?PostController@index`).

static async handle(req) {
    const url = new URL(req.url);
    const queryString = url.searchParams.toString();


// Phân tích query string bằng regex
    const match = queryString.match(/^([^@]+)@([^&]+)(?:&(.+))?$/);
    if (!match) {
      return Response.json(
        { error: "Định dạng query string không hợp lệ" },
        { status: 400 }
      );
    }

    const [, controllerName, action, params] = match;
    const searchParams = new URLSearchParams(params || "");
