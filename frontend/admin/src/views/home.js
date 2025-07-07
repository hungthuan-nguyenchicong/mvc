// ./src/views/home.js

class Home {
    constructor() {
        this.init();
    }

    render() {
        return /* html */ `
            <h1>Trang Home</h1>
            <p>Day la trang chu</p>
        `;
    }

    init() {
        document.title = 'Trang chu title';
    }
}

export default Home;