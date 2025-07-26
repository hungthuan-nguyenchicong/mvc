//web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        const scriptRender = script.toString();
        // const testClouse = script2.script3.toString();
        // Bước 1: Gọi hàm script2() để nhận được đối tượng { script3 }
        const script2Result = script2(); 
        
        // Bước 2: Truy cập thuộc tính script3 từ đối tượng nhận được và gọi toString()
        const testClouse = script2Result.script3.toString();
        const tesstSr4 = sr4.toString();
        // Trong render:
        const tesstSr4_v1 = sr4Variant1.toString();
        return /* html */ `
            <h1>Login</h1>
            <script>
                (${scriptRender})();
                (${testClouse})();
                (${tesstSr4})();
                (${tesstSr4_v1})();
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

    function sr4() {
        const scr5run = scr5();
        function scr5() {
            console.log(5)
        }
        return {scr5run}
    }
    return {
        render
    }

    //Phân tích và Ví dụ với Các Trường Hợp Khác của sr4

    // Biến thể của sr4
function sr4Variant1() {
    function scr5() {
        console.log("Variant 1: Inside scr5, returning a value");
        return "Hello from scr5"; // scr5 TRẢ VỀ một giá trị
    }
    const scr5result = scr5(); // scr5 được gọi và scr5result = "Hello from scr5"
    return { message: scr5result }; // sr4 trả về { message: "Hello from scr5" }
}

// Trong render:
//const tesstSr4_v1 = sr4Variant1.toString();
// console.log("Mã nguồn của sr4Variant1:", tesstSr4_v1); // Debug
// Trong <script>:
// (${tesstSr4_v1})();
}

export default loginPage();