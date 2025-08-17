// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

/**
 * Hiển thị giao diện người dùng cho trình soạn thảo WYSIWYG.
 * @returns {string} Chuỗi HTML của giao diện.
 */
function renderWysiwyg() {
  return /* html */ `
    <style>
      #content {
        border: 1px solid #ccc;
        padding: 10px;
        min-height: 200px;
        cursor: text;
      }
      #content:focus {
        outline: none;
        border-color: #007bff;
      }
      .toolbar {
        padding: 8px;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        border-bottom: none;
      }
    </style>
    <div class="toolbar">
      <div class="heading">
        <label for="heading">Choose a heading:</label>
        <select name="heading" id="heading">
          <option value="p">p</option>
          <option value="h1">h1</option>
          <option value="h2">h2</option>
          <option value="h3">h3</option>
        </select>
      </div>
    </div>
    <div id="content" contenteditable="true" style="min-height: 200px">
      <p><br></p>
    </div>
    <textarea id="hiddenContent" name="content" style="display: block;"></textarea>
  `;
}

/**
 * Khởi tạo logic xử lý sự kiện cho trình soạn thảo.
 */
function initWysiwygLogic() {
  const contentDiv = document.getElementById('content');
  const headingSelect = document.getElementById('heading');
  const hiddenTextarea = document.getElementById('hiddenContent');

  console.log('Đã bắt đầu hàm initWysiwygLogic.');
  console.log('Phần tử contentDiv:', contentDiv);
  console.log('Phần tử headingSelect:', headingSelect);
  console.log('Phần tử hiddenTextarea:', hiddenTextarea);

  if (!contentDiv || !headingSelect || !hiddenTextarea) {
    console.error('Lỗi: Không tìm thấy các phần tử DOM cần thiết.');
    return;
  }

  const updateContent = () => {
    // Log để kiểm tra hàm này có được gọi không
    console.log('Hàm updateContent được gọi.');
    // Log giá trị của trình soạn thảo
    console.log('Nội dung từ editor:', contentDiv.innerHTML);
    // Gán giá trị
    hiddenTextarea.value = contentDiv.innerHTML;
    // Log giá trị sau khi gán
    console.log('Giá trị của textarea sau khi cập nhật:', hiddenTextarea.value);
  };

  const updateHeadingDropdown = () => {
    // Log để kiểm tra hàm này có được gọi không
    console.log('Hàm updateHeadingDropdown được gọi.');
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let currentElement = range.startContainer;
    
    if (currentElement.nodeType === Node.TEXT_NODE) {
      currentElement = currentElement.parentNode;
    }

    const parentTag = currentElement.closest('p, h1, h2, h3, h4, h5, h6');
    if (parentTag) {
      headingSelect.value = parentTag.tagName.toLowerCase();
    } else {
      headingSelect.value = 'p';
    }
  };

  // Cập nhật nội dung mỗi khi có thay đổi
  contentDiv.addEventListener('input', updateContent); 
  
  // Cập nhật dropdown và nội dung khi con trỏ di chuyển hoặc thay đổi
  contentDiv.addEventListener('keyup', () => {
    updateHeadingDropdown();
    updateContent(); // Gọi lại hàm updateContent()
  });
  contentDiv.addEventListener('mouseup', () => {
    updateHeadingDropdown();
    updateContent(); // Gọi lại hàm updateContent()
  });

  // Tự động lưu nội dung mỗi 3 giây
  setInterval(updateContent, 3000);

  // Xử lý sự kiện khi nhấn phím Enter
  contentDiv.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      console.log('Phím Enter được nhấn.');
      event.preventDefault();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      let currentNode = range.startContainer;
      
      if (currentNode.nodeType === Node.TEXT_NODE) {
        currentNode = currentNode.parentNode;
      }
      
      const currentParagraph = currentNode.closest('p, h1, h2, h3, h4, h5, h6');
      if (currentParagraph) {
        const newParagraph = document.createElement('p');
        newParagraph.innerHTML = '<br>';
        currentParagraph.after(newParagraph);

        const newRange = document.createRange();
        newRange.setStart(newParagraph, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        
        updateContent(); // Cập nhật nội dung sau khi thêm đoạn mới
      }
    }
  });

  // Xử lý khi chọn một giá trị từ dropdown
  headingSelect.addEventListener('change', (event) => {
    console.log('Dropdown định dạng đã thay đổi.');
    const newTag = event.target.value;
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let currentElement = range.startContainer;

    if (currentElement.nodeType === Node.TEXT_NODE) {
      currentElement = currentElement.parentNode;
    }

    const parentElement = currentElement.closest('p, h1, h2, h3, h4, h5, h6');

    if (parentElement) {
      const content = parentElement.innerHTML;
      const newElement = document.createElement(newTag);
      newElement.innerHTML = content;
      parentElement.replaceWith(newElement);

      const newRange = document.createRange();
      newRange.selectNodeContents(newElement);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      updateContent(); // Cập nhật ngay sau khi thay đổi định dạng
    }
  });

  // Cập nhật giá trị ban đầu khi tải trang
  updateContent();
}

export { renderWysiwyg, initWysiwygLogic };