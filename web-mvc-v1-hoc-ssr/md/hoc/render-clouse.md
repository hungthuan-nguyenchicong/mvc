## Giải Thích và Phân Tích Kết Quả Console
### vd1
function script() {
    console.log("Kết quả từ script: 1");
}

const scriptRender = script.toString(); 

#render html

(${scriptRender})();

### Hàm lồng nhau trong đối tượng

function script2() {
    function script3() {
        console.log("Kết quả từ script3: 3");
    }
    return { script3 };
}

const script2Result = script2(); 
const testClouse = script2Result.script3.toString();


