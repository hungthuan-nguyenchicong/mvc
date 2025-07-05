export class UserDetail {
    constructor(mainContentElement, params = {}) {
        this.mainContentElement = mainContentElement;
        this.params = params; // Will contain { id: '123' }
    }

    async render() {
        if (!this.mainContentElement) return;
        this.mainContentElement.innerHTML = `
            <h1>User Profile</h1>
            <p>This is the profile for user ID: <strong>${this.params.id}</strong></p>
            <p><a href="/" route>Back to Home</a></p>
        `;
    }

    destroy() {
        console.log('UserDetail view destroyed.');
    }
}