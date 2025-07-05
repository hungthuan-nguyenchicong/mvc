## export default

You're encountering a common JavaScript (and TypeScript, given the .ts extension in the error message) error related to export default.

The error message:
'default' is not allowed as a variable declaration name.

And your code:
export const default homeInstane = new Home();

The Problem:

You're trying to use default as part of a const variable declaration name (default homeInstance). This is incorrect syntax. When you use export default, default itself isn't a variable name; it's a keyword that specifies the default export of the module.

Correct Solutions:

You have two main ways to correctly export the Home class or an instance of it, depending on what your Router.js expects:

Export the Home class as the default export (most common for components):
This is generally the preferred approach when your router expects to instantiate the component class after importing it (which your Router.js suggests with const ViewComponent = module.default;).

JavaScript

// In Home.js (or Home.ts)
class Home {
    constructor(params = {}) {
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
        // Potentially add logic here that runs after the view is rendered
    }
}

export default Home; // <-- Correct way to export the class as default
With this, in your Router.js, ViewComponent will correctly be the Home class, which you can then instantiate:

JavaScript

// In Router.js
// ...
const module = await viewContext(relativePathInContext);
const ViewComponent = module.default; // ViewComponent is now the 'Home' class

const viewInstance = new ViewComponent(matchedRoute.params); // Instantiate it
const content = await viewInstance.render();
// Then append 'content' to your DOM
// ...
Export a named instance (less common for dynamically loaded views that get instantiated):
If for some reason you wanted to export an already instantiated object, you would do it like this. However, this is less flexible if your components need different params based on the route.

JavaScript

// In Home.js (or Home.ts)
class Home {
    constructor(params = {}) {
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
        // Potentially add logic here that runs after the view is rendered
    }
}

export const homeInstance = new Home(); // <-- Correct way to export a named instance
With this, in your Router.js, you'd need to access it differently:

JavaScript

// In Router.js
// ...
const module = await viewContext(relativePathInContext);
const viewInstance = module.homeInstance; // Access the named export

const content = await viewInstance.render();
// Then append 'content' to your DOM
// ...
This approach means homeInstance would be created only once when the module is loaded, and all routes using this would share the same instance, which is usually not what you want for a view component that might need unique parameters per route.

Conclusion:

Given your Router.js structure and the typical pattern for SPA view components, export default Home; is almost certainly the solution you're looking for. It allows your router to dynamically load the Home class and then create a new instance of it for each route that matches.