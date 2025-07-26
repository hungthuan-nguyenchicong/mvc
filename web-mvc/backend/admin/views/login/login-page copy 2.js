//web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        return /* html */ `
            <h1>Login</h1>
            ${script()}
        `;
        
    }
    function script() {
        
        return /* html */ `
        <script>
            (function(){
                console.log('front end')
            })()

            console.log(2)
        </script>
        
        `;
    }
    return {
        render
    }
}

export default loginPage();