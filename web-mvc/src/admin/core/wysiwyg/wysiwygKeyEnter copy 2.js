// web-mvc/src/admin/core/wysiwyg/wysiwygKeyEnter.js

function wysiwygKeyEnter(content) {
    // content.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //         e.preventDefault();

    //         const selection = window.getSelection();
    //         const range = selection.getRangeAt(0);

    //         let currentNode = range.startContainer;
    //         if (currentNode.nodeType === Node.TEXT_NODE) {
    //             currentNode = currentNode.parentNode;
    //         }
    //         const currentParagraph = currentNode.closest('p, h1, h2, h3, h4, h5, h6');

    //         if (currentParagraph) {
    //             const newParagraph = document.createElement('p');
    //             newParagraph.innerHTML = '<br>';

    //             // Chèn thẻ p mới vào sau thẻ p hiện tại
    //             currentParagraph.after(newParagraph);

    //             const newRange = document.createRange();
    //             newRange.setStart(newParagraph, 0);
    //             newRange.collapse(true);

    //             selection.removeAllRanges();
    //             selection.addRange(newRange);
    //         }
    //     }
    // });
    // content.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //         e.preventDefault();

    //         const selection = window.getSelection();
    //         const range = selection.getRangeAt(0);

    //         const newParagrap = document.createElement('p');
    //         newParagrap.innerHTML = '<br>';

    //         const newRange = document.createRange();
    //         newRange.setStart(newParagrap, 0);
    //         newRange.collapse(true);

    //         selection.removeAllRanges();
    //         selection.addRange(newRange)
    //     }
    // });

    content.addEventListener('keydown', (e) => {
        // if (e.key === 'Enter') {
        //     e.preventDefault();

        //     // Get the current selection and range
        //     const selection = window.getSelection();
        //     const range = selection.getRangeAt(0);

        //     // Get the parent node of the cursor
        //     const parentNode = range.startContainer.parentNode;

        //     // Create the new paragraph element
        //     const newParagraph = document.createElement('p');
        //     // You can set some initial content to make the cursor visible
        //     newParagraph.innerHTML = '<br>';

        //     // Insert the new paragraph after the current one
        //     parentNode.after(newParagraph);

        //     // Position the cursor inside the new paragraph
        //     const newRange = document.createRange();
        //     newRange.selectNodeContents(newParagraph);
        //     newRange.collapse(true);

        //     selection.removeAllRanges();
        //     selection.addRange(newRange);
        // }
        if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn hành vi mặc định của Enter

            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);

            // Lấy node cha gần nhất của con trỏ
            let currentNode = range.startContainer;
            // Check if the current node is a text node. If so, get its parent element.
            if (currentNode.nodeType === Node.TEXT_NODE) {
                currentNode = currentNode.parentNode;
            }
            while (currentNode && currentNode.nodeName !== 'P' && currentNode.nodeName !== 'DIV' && currentNode.nodeName !== 'BODY') {
                currentNode = currentNode.parentNode;
            }

            // Tạo một thẻ <p> mới
            const newParagraph = document.createElement('p');
            newParagraph.innerHTML = '<br>'; // Chèn <br> để con trỏ hiển thị

            // Kiểm tra xem có đang ở trong thẻ <figcaption> không
            //const figcaptionNode = range.startContainer.closest('figcaption');
            // Now you can safely call .closest() on the element node
            const figcaptionNode = currentNode.closest('figcaption');

            if (figcaptionNode) {
                // Nếu đang ở trong <figcaption>, chèn <p> mới sau thẻ <figure> cha
                const figureNode = figcaptionNode.closest('figure');
                if (figureNode) {
                    figureNode.parentNode.insertBefore(newParagraph, figureNode.nextSibling);
                }
            } else {
                // Chèn thẻ <p> mới vào sau node hiện tại
                currentNode.parentNode.insertBefore(newParagraph, currentNode.nextSibling);
            }

            // Di chuyển con trỏ vào bên trong thẻ <p> vừa tạo
            const newRange = document.createRange();
            newRange.setStart(newParagraph, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    });
}

export { wysiwygKeyEnter }