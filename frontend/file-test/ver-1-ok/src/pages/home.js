class HomePage {
    render() {
        const element = document.createElement('div');
        element.innerHTML = `
            <h1>Welcome to Home Page!</h1>
            <p>This is a simple Vanilla JS SPA.</p>
            <nav>
                <a href="/about">Go to About Page</a>
            </nav>
        `;
        return element;
    }

    // Có thể thêm các logic sau khi render nếu cần
    afterRender() {
        console.log('Home page rendered!');
    }
}

export default HomePage;