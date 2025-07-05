## require.context()

Tuyệt vời! Bạn đã chỉ ra một điểm rất quan trọng trong việc xử lý các module động với Webpack. Việc sử dụng require.context() là một giải pháp mạnh mẽ, và tôi sẽ giải thích chi tiết tại sao chúng ta cần nó và cách nó hoạt động.

Tại sao cần require.context()?
Để hiểu tại sao require.context() lại cần thiết, chúng ta phải nhìn vào cách Webpack (công cụ đóng gói mã nguồn của bạn) và JavaScript modules (ES Modules với import/export) hoạt động.

Webpack là công cụ phân tích tĩnh (Static Analysis Tool):

Webpack được thiết kế để phân tích mã nguồn của bạn tại thời điểm biên dịch (compile time). Nó xây dựng một biểu đồ phụ thuộc (dependency graph) của tất cả các module trong ứng dụng của bạn.

Điều này có nghĩa là, khi Webpack chạy, nó cần biết chính xác tất cả các file JavaScript nào sẽ được sử dụng trong gói cuối cùng.

Vấn đề với import(variable) (Dynamic Imports với biến):

Khi bạn sử dụng cú pháp import(variable) (ví dụ: import(matchedRoute.file)), bạn đang yêu cầu tải một module động (dynamically), thường là để thực hiện lazy loading (tải lười) và code splitting (chia nhỏ mã). Điều này rất tốt cho hiệu suất ứng dụng.

Tuy nhiên, vấn đề phát sinh ở đây là Webpack không thể biết giá trị của variable này tại thời điểm biên dịch. Nó chỉ là một biến, và giá trị của nó có thể thay đổi trong quá trình chạy.

Vì Webpack không thể xác định tĩnh tất cả các module có thể được tải, nó không thể thêm chúng vào biểu đồ phụ thuộc của nó, dẫn đến lỗi Cannot find module mà bạn đã thấy. Webpack không biết làm thế nào để tạo ra các gói (chunk) cho các module mà nó không chắc chắn sẽ được yêu cầu.

Vấn đề tăng lên khi có Aliases (@views):

Khi bạn kết hợp import(variable) với aliases (như @views), sự phức tạp tăng lên. Webpack càng khó hơn trong việc giải quyết đường dẫn một cách chính xác khi alias nằm trong một chuỗi động. Nó có thể không áp dụng bí danh như mong đợi, hoặc tìm kiếm sai vị trí.

require.context(): Giải pháp cho việc nhập động trong ngữ cảnh tĩnh
Đây là lúc require.context() phát huy tác dụng. Nó là một hàm đặc biệt của Webpack (không phải là chuẩn JavaScript) được thiết kế để giải quyết chính xác vấn đề này:

require.context(directory, useSubdirectories, regExp)

directory (Đường dẫn):

'../views' trong trường hợp của bạn. Đây là đường dẫn tương đối từ file Router.js đến thư mục chứa tất cả các file view của bạn (src/views).

Điều này cho Webpack biết tĩnh một thư mục gốc mà nó cần quan tâm.

useSubdirectories (Sử dụng thư mục con):

true trong trường hợp của bạn. Điều này nói với Webpack rằng không chỉ quét thư mục chính (views/) mà còn quét tất cả các thư mục con bên trong đó (ví dụ: posts/ trong views/posts/PostIndex.js).

regExp (Biểu thức chính quy):

/\.js$/ trong trường hợp của bạn. Đây là một biểu thức chính quy (regular expression) nói với Webpack chỉ bao gồm các file có phần mở rộng là .js.

Cách require.context() hoạt động:

Khi Webpack xử lý dòng const viewContext = require.context('../views', true, /\.js$/); tại thời điểm biên dịch:

Nó sẽ quét toàn bộ thư mục src/views (và các thư mục con) dựa trên biểu thức chính quy.

Nó sẽ tạo ra một "context module" (mô-đun ngữ cảnh). Mô-đun này chứa một "bản đồ" của tất cả các đường dẫn file có thể có trong ngữ cảnh đó.

Quan trọng nhất, Webpack sẽ tạo ra các chunk riêng biệt cho mỗi file JavaScript mà nó tìm thấy trong ngữ cảnh này. Điều này đảm bảo rằng các module như Home.js, About.js, PostIndex.js... đều được đóng gói và sẵn sàng để tải.

Sau đó, khi bạn gọi viewContext(relativePathInContext) trong MapsTo:

relativePathInContext (ví dụ: './Home.js' hoặc './posts/PostIndex.js') là đường dẫn tương đối so với thư mục gốc của context (src/views).

Webpack đã có sẵn thông tin về tất cả các module trong context đó. Khi bạn yêu cầu một module cụ thể bằng cách truyền đường dẫn tương đối của nó, Webpack có thể tải chunk tương ứng một cách tin cậy.

Tóm lại:
require.context() là một cách để bạn cung cấp thông tin tĩnh cho Webpack về một tập hợp các module có thể được tải động, ngay cả khi tên module cụ thể được xác định bằng một biến tại thời điểm chạy. Nó giúp Webpack vượt qua giới hạn của việc phân tích tĩnh import(variable) bằng cách xây dựng một ngữ cảnh đã biết trước, từ đó loại bỏ lỗi Cannot find module và cho phép code splitting hiệu quả cho các thành phần được tải theo yêu cầu của router.