export class NotFound {
    constructor(mainContentElement, params = {}) {
        this.mainContentElement = mainContentElement;
        this.params = params;
    }

    async render() {
        if (!this.mainContentElement) return;
        this.mainContentElement.innerHTML = `
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <p><a href="/" route>Go to Home Page</a></p>
        `;
    }

    destroy() {
        console.log('404 view destroyed.');
    }
}