// web-mvc/backend/admin/controllers/TestController.js

class TestController {
    constructor(req) {
        this.req = req
    }
    index() {
        return new Response('Test Controller Index')
    }

    show(params = {}) {
        const {id = "1"} = params;
        return new Response(`show id: ${id}`)
    }

    create() {
        return new Response('Test Controller Create')
    }
}
export default TestController;