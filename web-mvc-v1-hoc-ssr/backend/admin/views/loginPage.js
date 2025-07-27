// web-mvc/backend/admin/views/loginPage.js

function loginPage() {
    function render() {
        return /* html */ `
            <body>
                <div class="login-container">
                    <h1>Login</h1>
                    <form id="loginForm" action="/admin/login" method="POST">
                        <div>
                            <label for="username">User Name <input type="text" id="username" name="username"></label><br>
                        </div>
                        <div>
                            <label for="password">Password <input type="password" id="password" name="password"></label><br>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div id="responseMessage" style="margin-top: 20px; color: green;"></div>
                </div>

                <script>
                    // This script runs on the client-side after the HTML is loaded
                    document.addEventListener('DOMContentLoaded', () => {
                        const form = document.getElementById('loginForm');
                        const responseMessageDiv = document.getElementById('responseMessage');

                        form.addEventListener('submit', async (event) => {
                            event.preventDefault(); // Prevent default form submission

                            const formData = new FormData(form);

                            try {
                                const response = await fetch('/admin/login', { // Corrected: comma after URL
                                    method: 'POST', // Corrected: 'POST' as a string
                                    body: formData
                                });
                                
                                const result = await response.json();
                                console.log(result);
                                responseMessageDiv.textContent = JSON.stringify(result); // Display response
                                responseMessageDiv.style.color = 'green';
                            } catch (error) {
                                console.error('Error during fetch:', error);
                                responseMessageDiv.textContent = 'Error: ' + error.message;
                                responseMessageDiv.style.color = 'red';
                            }
                        });
                    });
                </script>
            </body>
        `;
    }
    return {
        render
    }

    // send post
    // async function sendRequest() {
    //     const form = document.getElementById('login');
    //     const formData = new FormData(form)

    //     const btnLogin = form.querySelector('button[type=submit]');
    //     btnLogin.preventDefault();
    //     //const handleSubmit
    //     try {
    //         const response = await fetch('/admin/login', {
    //             method: 'POST',
    //             body: formData
    //         })
    //         const result = await response.json();
    //         console.log(result)
    //     } catch(error) {
    //         console.error(error);
    //     }
    // }
}

export default loginPage();