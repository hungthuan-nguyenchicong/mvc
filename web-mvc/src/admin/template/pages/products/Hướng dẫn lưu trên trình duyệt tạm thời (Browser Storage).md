## Hướng dẫn lưu trên trình duyệt tạm thời (Browser Storage)

Để thực hiện các chức năng đã đề cập, bạn không cần tạo thêm một bảng riêng chỉ để lưu bản nháp. Thay vào đó, bạn có thể thêm một cột vào bảng hiện có và sử dụng bộ nhớ trình duyệt để lưu tạm thời.

1. Lưu bản nháp (Drafts) trong cơ sở dữ liệu
Cách đơn giản và hiệu quả nhất là thêm một cột content_draft vào bảng hiện tại của bạn (ví dụ: bảng posts hoặc products).

Cấu trúc bảng sau khi chỉnh sửa:

SQL

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_draft TEXT,
  status VARCHAR(50) DEFAULT 'draft' -- Có thể dùng cột status để quản lý trạng thái
);
content: Lưu nội dung chính thức, đã được duyệt hoặc công bố.

content_draft: Lưu nội dung nháp.

status: Cột này rất hữu ích để quản lý trạng thái của bài viết, ví dụ: 'draft', 'published', 'archived'.

Quy trình lưu và xử lý:

Khi người dùng nhập liệu, chức năng Autosave sẽ gửi dữ liệu và cập nhật cột content_draft định kỳ.

Khi người dùng nhấn nút Save (để công bố), bạn sẽ copy dữ liệu từ cột content_draft sang cột content và cập nhật status thành 'published'.

Nếu người dùng chỉ muốn lưu nháp mà không công bố, họ vẫn có thể nhấn một nút "Save Draft", chức năng này chỉ cần cập nhật cột content_draft và không thay đổi status.


Do Google cấp phép
2. Hướng dẫn lưu trên trình duyệt tạm thời (Browser Storage)
Bạn có thể sử dụng localStorage để lưu nội dung trực tiếp trên trình duyệt của người dùng. Dữ liệu này sẽ tồn tại ngay cả khi họ đóng trình duyệt.

Cách triển khai với JavaScript:

Lắng nghe sự kiện thay đổi: Sử dụng JavaScript để lắng nghe các sự kiện thay đổi trên các trường nhập liệu (input, textarea).

JavaScript

const contentTextarea = document.getElementById('my-content-editor');

contentTextarea.addEventListener('input', function() {
  const content = contentTextarea.value;
  // Lưu nội dung vào localStorage với một khóa duy nhất
  localStorage.setItem('editor_draft_content', content);
  console.log('Nội dung đã được lưu vào trình duyệt.');
});
Khôi phục khi tải lại trang: Khi trang được tải, kiểm tra xem có dữ liệu nào trong localStorage không. Nếu có, hãy điền nó vào trình soạn thảo.

JavaScript

window.onload = function() {
  const savedContent = localStorage.getItem('editor_draft_content');
  const contentTextarea = document.getElementById('my-content-editor');

  if (savedContent) {
    // Có thể hiển thị một thông báo hỏi người dùng có muốn khôi phục không
    const confirmRestore = confirm('Có một bản nháp chưa được lưu. Bạn có muốn khôi phục không?');
    if (confirmRestore) {
      contentTextarea.value = savedContent;
      console.log('Nội dung đã được khôi phục từ trình duyệt.');
    }
  }
};
Xóa dữ liệu tạm sau khi lưu: Khi người dùng nhấn nút Save và dữ liệu đã được gửi thành công lên server, hãy xóa dữ liệu trong localStorage để tránh nhầm lẫn.

JavaScript

document.getElementById('save-button').addEventListener('click', function() {
  // Gửi dữ liệu lên server...

  // Nếu thành công, xóa bản nháp trong localStorage
  localStorage.removeItem('editor_draft_content');
  console.log('Bản nháp đã được xóa khỏi trình duyệt.');
});





Khi người dùng nhập liệu, chức năng Autosave sẽ gửi dữ liệu và cập nhật cột content_draft định kỳ. làm sao chúng sẽ bị dính id SERIAL PRIMARY KEY,

slug VARCHAR(255) UNIQUE NOT NULL, khi create nếu create -->> hay update drap



Khi người dùng nhập liệu và sử dụng chức năng Autosave, bạn cần phân biệt rõ hai trường hợp: tạo mới một bản ghi và cập nhật một bản ghi đã có.

1. Khi tạo mới bản ghi (CREATE)
Nếu đây là lần đầu tiên người dùng soạn thảo nội dung, bản ghi đó chưa tồn tại trong cơ sở dữ liệu.

Tạo bản nháp ban đầu: Khi người dùng bắt đầu nhập liệu, bạn sẽ gửi một yêu cầu INSERT để tạo một bản ghi mới trong bảng products.

Chèn dữ liệu tối thiểu: Trong yêu cầu này, bạn chỉ cần chèn dữ liệu cần thiết để tạo bản ghi, đó là slug và content_draft.

id SERIAL PRIMARY KEY: Trường này sẽ tự động được tạo bởi PostgreSQL, bạn không cần phải cung cấp nó.

slug: Bạn có thể tạo một slug tạm thời hoặc ngẫu nhiên. Ví dụ: temp-draft- + một chuỗi ngẫu nhiên. Giá trị này không cần phải hoàn chỉnh vì nó chỉ là bản nháp.

content_draft: Chèn nội dung người dùng vừa nhập.

status: Đặt trạng thái là 'draft'.

Ví dụ câu lệnh SQL:

SQL

INSERT INTO products (slug, content_draft, status)
VALUES ('temp-draft-12345', 'Nội dung bản nháp đầu tiên...', 'draft');
Sau khi chèn thành công, bạn sẽ nhận được id của bản ghi mới. Hãy lưu lại id này trên giao diện người dùng (ví dụ: trong một trường ẩn) để sử dụng cho các lần cập nhật sau.

2. Khi cập nhật bản nháp (UPDATE)
Nếu bản ghi đã tồn tại (người dùng đã tạo nháp hoặc quay lại chỉnh sửa), bạn sẽ sử dụng id đã lưu để cập nhật.

Sử dụng ID đã có: Khi chức năng Autosave kích hoạt, bạn sẽ gửi một yêu cầu UPDATE đến server.

Cập nhật dữ liệu: Yêu cầu này sẽ sử dụng id để tìm bản ghi chính xác và chỉ cập nhật cột content_draft với nội dung mới nhất.

Ví dụ câu lệnh SQL:

SQL

UPDATE products
SET content_draft = 'Nội dung đã được cập nhật...',
WHERE id = 101; -- Sử dụng ID của bản ghi đã lưu
Như vậy, bạn không cần phải lo lắng về id và slug khi cập nhật bản nháp. id dùng để định danh bản ghi, còn slug chỉ cần được xử lý khi người dùng nhấn nút "Save" để xuất bản, lúc đó bạn sẽ tạo một slug hoàn chỉnh, duy nhất và gán nó vào cột slug chính thức.
## update btn save

Để một nút "Save" có thể vừa tạo mới bản nháp vừa cập nhật bản nháp đang có, bạn cần xây dựng một **logic có điều kiện** trên cả giao diện người dùng (client-side) và máy chủ (server-side). Về cơ bản, nút "Save" sẽ gửi một yêu cầu đến máy chủ, và máy chủ sẽ quyết định hành động (`INSERT` hay `UPDATE`) dựa trên việc dữ liệu có chứa một mã định danh duy nhất (`id`) hay không.

-----

### **1. Trên giao diện người dùng (Client-side)**

Bạn cần một trường ẩn (`<input type="hidden">`) hoặc một biến JavaScript để lưu trữ **ID** của bài viết.

  * **Khi bắt đầu viết bài mới:** Trang chỉnh sửa sẽ không có ID. Nút "Save" sẽ gửi yêu cầu không kèm theo ID.
  * **Khi lưu lần đầu:** Máy chủ sẽ tạo một bản ghi mới, gán một ID và trả lại ID đó cho trình duyệt. Bạn sẽ dùng JavaScript để lấy ID này và gán vào trường ẩn.
  * **Từ lần lưu thứ hai trở đi:** Vì đã có ID trong trường ẩn, nút "Save" sẽ gửi yêu cầu kèm theo ID này.

-----

### **2. Trên máy chủ (Server-side)**

Điểm mấu chốt là logic xử lý của API "save" của bạn. API này phải kiểm tra xem trong dữ liệu nhận được có ID hay không.

Dưới đây là sơ đồ luồng hoạt động đơn giản:

```
Nhận dữ liệu từ trình duyệt
      |
      V
Kiểm tra: Dữ liệu có chứa ID không?
      |
+-----CÓ----+
|           |
V           V
Đã có bản ghi này.  Là bản ghi mới.
Thực hiện câu lệnh    Thực hiện câu lệnh
  UPDATE...           INSERT...
      |                  |
      V                  V
    Lưu nội dung nháp    Tạo bản ghi mới,
    vào cột content_draft.  lưu nội dung nháp và
                        trả về ID vừa tạo.
```

**Ví dụ về logic trên máy chủ (dạng mã giả):**

```
// Điểm cuối API nhận yêu cầu POST/PUT từ nút "Save"
function handleSaveRequest(request) {
  const { id, content_draft } = request.body;

  if (id) {
    // Trường hợp 1: Có ID, đây là bản nháp đã tồn tại.
    // Thực hiện câu lệnh UPDATE
    const sqlQuery = `UPDATE products SET content_draft = ? WHERE id = ?`;
    database.execute(sqlQuery, [content_draft, id]);
    return { success: true, message: 'Đã cập nhật bản nháp.' };
  } else {
    // Trường hợp 2: Không có ID, đây là bản nháp mới.
    // Thực hiện câu lệnh INSERT
    const temporarySlug = 'temp-draft-' + generateRandomString();
    const sqlQuery = `INSERT INTO products (slug, content_draft, status) VALUES (?, ?, 'draft')`;
    const newRecordId = database.execute(sqlQuery, [temporarySlug, content_draft]);
    
    return { success: true, message: 'Đã tạo bản nháp mới.', id: newRecordId };
  }
}
```

Bằng cách này, chỉ với một API duy nhất và một nút "Save", bạn đã xử lý được cả hai kịch bản **tạo mới** và **cập nhật** một cách linh hoạt. Logic này hoàn toàn tách biệt việc lưu nháp với việc chính thức hóa nội dung, mang lại sự an toàn và tiện lợi cho người dùng.

## tham khảo 
Để triển khai logic này, bạn cần sử dụng một **kênh truyền dữ liệu** để gửi ID từ máy chủ về lại trình duyệt. Thông thường, điều này được thực hiện thông qua phản hồi (response) của yêu cầu HTTP.

### **1. Lưu ID trên giao diện người dùng (Front-end)**

Khi người dùng lần đầu tiên nhấn "Save" để tạo một bản nháp mới, front-end sẽ gửi yêu cầu POST đến máy chủ mà không có ID.

  * **Front-end gửi yêu cầu (request):**

    ```json
    {
      "content_draft": "Nội dung bản nháp đầu tiên..."
    }
    ```

  * **Máy chủ xử lý và trả về ID (response):** Máy chủ sẽ tạo bản ghi mới trong cơ sở dữ liệu và trả về một phản hồi JSON chứa ID của bản ghi vừa tạo.

    ```json
    {
      "success": true,
      "message": "Đã tạo bản nháp mới.",
      "id": 12345
    }
    ```

  * **Front-end nhận ID:** Sau khi nhận được phản hồi này, bạn sẽ sử dụng JavaScript để lấy giá trị `id` (`12345`) và lưu nó vào một biến trong bộ nhớ hoặc một trường ẩn trong form HTML.

    ```javascript
    // Ví dụ sử dụng fetch API
    fetch('/api/save-content', {
      method: 'POST',
      body: JSON.stringify({ content_draft: '...' })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Lưu ID vào một trường ẩn
        document.getElementById('hidden-id-field').value = data.id;
        // Hoặc lưu vào biến
        window.currentContentId = data.id; 
      }
    });
    ```

-----

### **2. Gửi ID trong các lần cập nhật sau**

Khi người dùng tiếp tục chỉnh sửa, front-end sẽ kiểm tra xem đã có ID được lưu chưa. Nếu có, nó sẽ gửi ID đó cùng với dữ liệu lên máy chủ thông qua yêu cầu PUT hoặc POST.

  * **Front-end gửi yêu cầu (request):**
    ```json
    {
      "id": 12345,
      "content_draft": "Nội dung đã được cập nhật..."
    }
    ```
  * **Máy chủ xử lý:** Lúc này, máy chủ sẽ nhận ra có ID và thực hiện câu lệnh `UPDATE` thay vì `INSERT`.

Bằng cách này, ID của bản ghi sẽ được luân chuyển giữa máy chủ và trình duyệt, cho phép một nút "Save" duy nhất thực hiện cả hai chức năng: tạo mới khi ID chưa tồn tại và cập nhật khi ID đã được thiết lập.