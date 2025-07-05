class Home {
    constructor(params = {}) {
        //this.mainContentElement = null;
        this.params = params;
    }

    async render() {
        return /* html */ `
            <h1>Trang Home (Home Page)</h1>
            <p>Welcome to your single-page application!</p>
            <p>You can add more content here.</p>
            <p>Here's a link to a dynamic route: <a href="/users/123" route>User 123</a></p>
        `;
    }

    async init() {
        await this.render();
    }
}

export default Home;

//export const homeInstance = new Home(); // <-- Correct way to export a named instance