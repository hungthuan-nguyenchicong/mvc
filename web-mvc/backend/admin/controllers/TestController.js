// web-mvc/backend/admin/controllers/TestController.js
class TestController {
    constructor(req) {
        this.req = req
    }

    index() {
        if (this.req.method === "POST") {
            return Response.json({id: 'ok'});
        } else {
            //405 Method Not Allowed
            return Response.json({error: 'error'}, {status:405});
        }
    }
    show(params = {}) {
        const {id=1} = params
        return new Response(`test index: ${id}`);
    }
}

export {TestController};