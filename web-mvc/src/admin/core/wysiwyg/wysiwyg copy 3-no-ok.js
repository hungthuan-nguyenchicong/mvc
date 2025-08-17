// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

function wysiwyg() {
    return render()
}
// &nbsp;
// <p><br></p>
function render() {
    return /* html */ `
    <div class="toolbar"></div>
    <div id="content" contenteditable="true" style="min-height: 200px"><p><br></p></div>
    `;
}

// function logic() {
//     const contentDiv = document.getElementById('content');

//     contentDiv.addEventListener('keydown', function(event) {
//         // Kiểm tra nếu phím Enter được nhấn và con trỏ đang ở cuối dòng
//         if (event.key === 'Enter') {
//             // Ngăn chặn hành vi mặc định của trình duyệt (thường là chèn <div> hoặc <br>)
//             event.preventDefault();

//             // Chèn một thẻ <p> mới
//             const newParagraph = document.createElement('p');
//             newParagraph.innerHTML = '<br>';

//             // Chèn thẻ <p> mới vào sau thẻ <p> hiện tại
//             const selection = window.getSelection();
//             const range = selection.getRangeAt(0);

//             range.deleteContents(); // Xóa nội dung được chọn (nếu có)
//             range.insertNode(newParagraph); // Chèn thẻ <p> mới vào vị trí con trỏ

//             // Di chuyển con trỏ vào trong thẻ <p> mới
//             range.setStart(newParagraph, 0);
//             range.collapse(true);
//         }
//     });
// }

// function logic() {
//     const contentDiv = document.getElementById('content');

//     // Sử dụng sự kiện 'input' để kiểm tra nội dung
//     contentDiv.addEventListener('input', function() {
//         // Lấy đoạn văn bản cuối cùng
//         const lastP = contentDiv.querySelector('p:last-child');
        
//         // Nếu đoạn văn bản cuối cùng rỗng, chèn &nbsp; vào đó để giữ con trỏ
//         if (lastP && lastP.textContent.trim() === '' && lastP.innerHTML !== '&nbsp;') {
//             lastP.innerHTML = '&nbsp;';
            
//             // Đặt con trỏ vào cuối thẻ p
//             const selection = window.getSelection();
//             const range = document.createRange();
//             range.selectNodeContents(lastP);
//             range.collapse(false);
//             selection.removeAllRanges();
//             selection.addRange(range);
//         }
//     });

//     contentDiv.addEventListener('keydown', function(event) {
//         if (event.key === 'Enter') {
//             event.preventDefault();

//             // Tạo một thẻ <p> mới
//             const newParagraph = document.createElement('p');

//             // Chèn &nbsp; vào thẻ p mới để con trỏ hiển thị ngay lập tức
//             newParagraph.innerHTML = '&nbsp;';

//             const selection = window.getSelection();
//             const range = selection.getRangeAt(0);

//             // Xóa nội dung được chọn và chèn thẻ p mới
//             range.deleteContents();
//             range.insertNode(newParagraph);
            
//             // Di chuyển con trỏ vào trong thẻ p mới
//             range.setStart(newParagraph, 0);
//             range.collapse(true);
//         }
//     });
// }

function logic() {
    const contentDiv = document.getElementById('content');

    contentDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // Lấy node cha hiện tại của con trỏ
            const parentNode = range.startContainer.parentNode;

            // Chèn một thẻ p mới
            const newParagraph = document.createElement('p');

            // Nếu con trỏ đang ở đầu một đoạn văn
            if (range.startOffset === 0) {
                newParagraph.innerHTML = '&nbsp;';
            } else {
                // Tách nội dung sau con trỏ sang thẻ p mới
                const remainingText = range.startContainer.nodeValue.substring(range.startOffset);
                newParagraph.textContent = remainingText;
                range.startContainer.nodeValue = range.startContainer.nodeValue.substring(0, range.startOffset);
            }

            // Chèn thẻ p mới vào DOM
            parentNode.after(newParagraph);
            
            // Di chuyển con trỏ vào thẻ p mới
            const newRange = document.createRange();
            newRange.setStart(newParagraph, 0);
            newRange.collapse(true);
            
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    });
}

export {wysiwyg, logic}