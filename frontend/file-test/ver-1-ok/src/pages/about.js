class AboutPage {
    render() {
        const element = document.createElement('div');
        element.innerHTML = `
            <h1>About Us</h1>
            <p>This is the About page of our Vanilla JS SPA.</p>
            <nav>
                <a href="/">Go to Home Page</a>
            </nav>
        `;
        return element;
    }
}

export default AboutPage;