// ./src/utils/error-page.js

class ErrorPage {
    constructor() {

        fetch('/admin/views/', { 
            redirect: 'manual' // Instructs fetch not to follow redirects automatically
        })
            .then(response => {
                
                // If the server returns 302, fetch (with redirect: 'manual') 
                // will resolve the promise with a status 302.
                // Alternatively, 'opaqueredirect' type indicates a cross-origin redirect was encountered.
                if (response.status === 302 || response.status === 401 || response.type === 'opaqueredirect') {
                    // Manually redirect the browser
                    window.location.href = '/admin/login';
                } else if (response.ok) {
                    // Handle successful access (200 OK)
                } else {
                    // Handle other HTTP errors
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

export const errorPageInstance = new ErrorPage();