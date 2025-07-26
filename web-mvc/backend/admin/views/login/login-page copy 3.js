//web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        const scriptRender = script.toString();
        // const testClouse = script2.script3.toString();
        // Bước 1: Gọi hàm script2() để nhận được đối tượng { script3 }
        const script2Result = script2(); 
        
        // Bước 2: Truy cập thuộc tính script3 từ đối tượng nhận được và gọi toString()
        const testClouse = script2Result.script3.toString();
        return /* html */ `
            <h1>Login</h1>
            <script>
                (${scriptRender})();
                (${testClouse})();
            </script>
        `;
        
    }
    function script() {
        console.log(1)
    }

    function script2() {
        function script3() {
            console.log(3)
        }
        return {script3}
    }
    return {
        render
    }
}

export default loginPage();