// web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    function render() {
        // --- Trường hợp 1: Hàm 'script' đơn giản ---
        const scriptRender = script.toString(); 

        // --- Trường hợp 2: Hàm 'script3' lồng trong 'script2' và được trả về trong một đối tượng ---
        const script2Result = script2(); 
        const testClouse = script2Result.script3.toString();

        // --- Các trường hợp khác của sr4 để minh họa ---

        // Trường hợp 3a: sr4 (cách bạn đã test ban đầu, hoạt động nhưng có thể gây nhầm lẫn)
        // sr4 chứa scr5 và gọi scr5() bên trong nó.
        // tesstSr4_case3a sẽ là TOÀN BỘ mã nguồn của hàm sr4.
        const tesstSr4_case3a = sr4_case3a.toString(); 

        // Trường hợp 3b: sr4 (cách FIX được đề xuất để chỉ lấy mã nguồn của scr5)
        // sr4_case3b TRẢ VỀ đối tượng chứa hàm scr5 (không gọi scr5 bên trong sr4).
        const sr4Result_case3b = sr4_case3b(); 
        const tesstSr4_case3b = sr4Result_case3b.scr5.toString(); 

        // Trường hợp 3c: sr4 (trả về trực tiếp một hàm)
        // sr4_case3c TRẢ VỀ một hàm ẩn danh. toString() sẽ lấy mã nguồn của sr4_case3c.
        // Để chạy hàm con, cần gọi thêm một cặp () nữa.
        const tesstSr4_case3c = sr4_case3c.toString(); 
        
        // Trường hợp 3d: sr4 (có logic phức tạp, không liên quan đến hàm con cụ thể)
        // Minh họa việc sr4 có thể có các biến cục bộ, logic riêng...
        const tesstSr4_case3d = sr4_case3d.toString();

        return /* html */ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login Page Test</title>
            </head>
            <body>
                <h1>Login Page Tests</h1>
                <p>Check console for output.</p>
                
                <script>
                    console.log("--- Bắt đầu các Script nhúng ---");

                    // 1. Script từ hàm 'script' đơn giản
                    console.log("\\n--- Chạy script() ---");
                    (${scriptRender})(); 

                    // 2. Script từ hàm 'script3' lồng trong 'script2'
                    console.log("\\n--- Chạy script3() (từ script2) ---");
                    (${testClouse})();

                    // 3a. Script từ sr4_case3a (cách ban đầu của bạn)
                    // Sẽ thực thi TOÀN BỘ mã nguồn của sr4_case3a
                    console.log("\\n--- Chạy sr4_case3a() (toàn bộ nội dung của sr4) ---");
                    (${tesstSr4_case3a})(); 

                    // 3b. Script từ scr5 (từ sr4_case3b) - Cách khuyến nghị để lấy hàm con
                    // Sẽ chỉ thực thi mã nguồn của scr5
                    console.log("\\n--- Chạy scr5() (từ sr4_case3b - cách đúng để nhúng hàm con) ---");
                    (${tesstSr4_case3b})(); 

                    // 3c. Script từ sr4_case3c (trả về một hàm con)
                    // Mã nguồn của sr4_case3c được nhúng, sau đó sr4_case3c được gọi,
                    // và sau đó HÀM ĐƯỢC TRẢ VỀ từ sr4_case3c cũng được gọi.
                    console.log("\\n--- Chạy sr4_case3c() (gọi hàm được trả về) ---");
                    ((${tesstSr4_case3c})())(); // Hai cặp () để chạy hàm trả về

                    // 3d. Script từ sr4_case3d (logic phức tạp hơn)
                    console.log("\\n--- Chạy sr4_case3d() (hàm có logic riêng) ---");
                    (${tesstSr4_case3d})();

                    console.log("\\n--- Kết thúc các Script nhúng ---");
                </script>
            </body>
            </html>
        `;
    }

    // --- Định nghĩa các hàm để toString() ---

    // Hàm 1: Đơn giản
    function script() {
        console.log("Kết quả từ script: 1");
    }

    // Hàm 2: Hàm lồng nhau và trả về qua đối tượng
    function script2() {
        function script3() {
            console.log("Kết quả từ script3: 3");
        }
        return { script3 };
    }

    // Hàm 3a: sr4 theo cách bạn đã viết ban đầu (sẽ thực thi toàn bộ nội dung của sr4)
    function sr4_case3a() {
        console.log("--- Bắt đầu trong sr4_case3a ---");
        const scr5run_a = scr5_a(); // Lệnh gọi này sẽ chạy khi sr4_case3a được thực thi
        function scr5_a() {
            console.log("Kết quả từ scr5_a (bên trong sr4_case3a): 5a");
        }
        console.log("sr4_case3a trả về:", { scr5run_a }); // scr5run_a là undefined
        console.log("--- Kết thúc trong sr4_case3a ---");
        return { scr5run_a }; // sr4_case3a trả về { scr5run_a: undefined }
    }

    // Hàm 3b: sr4 theo cách FIX được đề xuất (chỉ để lấy mã nguồn của scr5)
    function sr4_case3b() {
        function scr5() {
            console.log("Kết quả từ scr5 (được gọi riêng từ sr4_case3b): 5b");
        }
        return { scr5 }; // sr4_case3b trả về đối tượng chứa hàm scr5
    }

    // Hàm 3c: sr4 trả về trực tiếp một hàm
    function sr4_case3c() {
        // Hàm này sẽ được trả về từ sr4_case3c
        return function innerFunction_3c() {
            console.log("Kết quả từ hàm được trả về trực tiếp bởi sr4_case3c: 5c");
        };
    }

    // Hàm 3d: sr4 với logic riêng, không tập trung vào hàm con được trả về
    function sr4_case3d() {
        let counter = 0;
        console.log("--- Bắt đầu trong sr4_case3d ---");
        
        function increment() {
            counter++;
            console.log("Counter:", counter);
        }

        increment(); // Hàm này được gọi khi sr4_case3d chạy

        if (counter === 1) {
            console.log("Logic riêng của sr4_case3d đã chạy thành công.");
        }
        console.log("--- Kết thúc trong sr4_case3d ---");
        return { status: "completed" }; // sr4_case3d trả về một đối tượng khác
    }

    return {
        render
    };
}

export default loginPage();