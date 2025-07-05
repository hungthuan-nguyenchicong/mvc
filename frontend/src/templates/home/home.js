// src/templates/home/home.js
export class Home {
    // The mainContentElement will be passed by the Router
    constructor(mainContentElement, params = {}) {
        this.mainContentElement = mainContentElement;
        this.params = params; // In case home page ever needs params
    }

    // This method will update the DOM
    async render() {
        if (!this.mainContentElement) {
            console.error('Main content element is not provided to Home view.');
            return;
        }
        this.mainContentElement.innerHTML = /* html */ `
            <h1>Trang Home (Home Page)</h1>
            <p>Welcome to your single-page application!</p>
            <p>You can add more content here.</p>
            <p>Here's a link to a dynamic route: <a href="/users/123" route>User 123</a></p>
        `;
    }

    // Optional: A cleanup method if the view attaches event listeners etc.
    destroy() {
        console.log('Home view destroyed.');
        // Remove any event listeners specific to the home view here if needed
    }
}