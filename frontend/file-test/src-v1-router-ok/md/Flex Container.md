## Flex Container

<div class="div-a">
  <div class="div-b">
    <p>Nội dung của div B.</p>
    <p>Đây là một đoạn văn bản dài hơn trong div B để thử nghiệm chiều cao.</p>
  </div>
  <div class="div-c">
    <p>Nội dung của div C.</p>
  </div>
</div>

.div-a {
  display: flex;
  /* Các mục con sẽ xếp theo hàng ngang */
  /* align-items: stretch; là giá trị mặc định,
     khiến các mục con kéo dài để lấp đầy chiều cao của container.
     Để chúng không kéo dài, bạn cần thay đổi giá trị này. */
}

.div-b {
  /* Các thuộc tính CSS khác cho div B */
  border: 1px solid blue; /* Để dễ nhìn */
  padding: 10px;
}

.div-c {
  /* Các thuộc tính CSS khác cho div C */
  border: 1px solid green; /* Để dễ nhìn */
  padding: 10px;
}

.div-a {
  display: flex;
  /* Thay đổi giá trị mặc định 'stretch' thành 'flex-start', 'flex-end', hoặc 'center' */
  align-items: flex-start; /* Các mục con sẽ căn chỉnh ở đầu container và chỉ cao vừa nội dung */
  /* Hoặc:
  align-items: center; // Các mục con sẽ căn giữa và chỉ cao vừa nội dung
  align-items: flex-end; // Các mục con sẽ căn cuối và chỉ cao vừa nội dung
  */
  gap: 20px; /* Thêm khoảng cách giữa các div con */
  border: 1px solid red; /* Để dễ nhìn div a */
  padding: 10px;
}

.div-b {
  border: 1px solid blue;
  padding: 10px;
}

.div-c {
  border: 1px solid green;
  padding: 10px;
}