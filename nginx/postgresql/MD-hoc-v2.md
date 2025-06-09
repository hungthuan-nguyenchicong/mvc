# cac quyen co ban
Bạn đã liệt kê một bộ quyền rất tốt và khá đầy đủ cho một user ứng dụng (như cong) để thực hiện các thao tác CRUD cơ bản trên các bảng trong schema public.

Bộ quyền bạn đã cấp:

GRANT CONNECT ON DATABASE mvcdb TO cong;: Cho phép cong kết nối vào database.
GRANT USAGE ON SCHEMA public TO cong;: Cho phép cong truy cập vào các đối tượng (như bảng, sequence) trong schema public.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cong;: Cho phép cong thực hiện CRUD trên tất cả các bảng hiện có trong public schema.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO cong;: Đảm bảo cong có quyền USAGE trên các sequence được tạo trong tương lai trong public schema (quan trọng cho các cột SERIAL).
Các quyền cơ bản còn cần gì thêm không?
Phụ thuộc vào nhu cầu cụ thể của ứng dụng của bạn. Dưới đây là một số trường hợp và quyền bổ sung có thể cần hoặc không cần:

1. Quyền trên SEQUENCE đã tồn tại:

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO cong; chỉ áp dụng cho các sequence được tạo SAU khi lệnh này được thực hiện.
Nếu bạn đã có các bảng với cột SERIAL trước khi chạy lệnh ALTER DEFAULT PRIVILEGES, bạn cần phải cấp quyền USAGE cho từng sequence đó một cách thủ công:
SQL

GRANT USAGE ON SEQUENCE ten_bang_id_seq TO cong; -- Lặp lại cho từng sequence hiện có
Đây là một điểm thường bị bỏ sót.
2. Quyền trên VIEWS (Nếu ứng dụng sử dụng Views):

Nếu ứng dụng của bạn truy vấn dữ liệu thông qua các VIEW thay vì trực tiếp từ TABLES, bạn cần cấp quyền SELECT trên các VIEW đó.
SQL

GRANT SELECT ON ALL TABLES IN SCHEMA public TO cong; -- Chỉ áp dụng cho TABLES, KHÔNG phải VIEWS
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO cong; -- Sai cú pháp
-- Cú pháp đúng cho VIEWS:
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cong; -- Áp dụng cho bảng
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO cong; -- Áp dụng cho sequence

-- Sử dụng đúng cú pháp cho VIEWS:
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cong; -- Dòng này chỉ cấp quyền cho TABLEs, không phải VIEWS

-- Để cấp quyền SELECT cho VIEWS:
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cong; -- Cái này chỉ cho TABLEs
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO cong; -- DÒNG NÀY ĐÚNG CHO VIEWS
Hoặc cho từng View cụ thể:
SQL

GRANT SELECT ON VIEW ten_view TO cong;
Tương tự, nếu bạn có ALTER DEFAULT PRIVILEGES cho VIEWS được tạo trong tương lai:
SQL

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON VIEWS TO cong;
3. Quyền thực thi FUNCTIONs/PROCEDUREs (Nếu ứng dụng gọi hàm/thủ tục):

Nếu ứng dụng của bạn gọi các hàm hoặc thủ tục lưu trữ (stored functions/procedures) trong database, user cong cần quyền EXECUTE trên chúng.
SQL

GRANT EXECUTE ON FUNCTION ten_ham(arg1_type, arg2_type) TO cong;
-- Hoặc cho tất cả hàm/thủ tục trong schema:
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO cong;
4. Quyền TRUNCATE (Xóa nhanh toàn bộ dữ liệu bảng):

Lệnh TRUNCATE xóa tất cả các hàng khỏi một bảng nhanh hơn DELETE và không kích hoạt triggers (mặc định) cũng như không thể được rollback dễ dàng nếu không có transaction.
Nếu ứng dụng của bạn cần khả năng này (ví dụ: để làm sạch một bảng ghi log), bạn sẽ cần cấp quyền TRUNCATE:
SQL

GRANT TRUNCATE ON TABLE ten_bang TO cong;
-- Hoặc cho tất cả bảng:
GRANT TRUNCATE ON ALL TABLES IN SCHEMA public TO cong;
-- Hoặc cho các bảng tương lai:
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT TRUNCATE ON TABLES TO cong;
Cảnh báo: Quyền TRUNCATE rất mạnh và nên được cấp rất hạn chế.
5. Quyền trên FOREIGN TABLES (Nếu sử dụng Foreign Data Wrappers - FDW):

Nếu bạn kết nối đến các nguồn dữ liệu bên ngoài thông qua FDW, user cong cần quyền SELECT trên các Foreign Tables.
6. Quyền REFERENCES (Để tạo Foreign Keys):

Nếu user cong cần tạo các khóa ngoại (Foreign Keys) trỏ đến các bảng khác, họ sẽ cần quyền REFERENCES trên các bảng được tham chiếu.
Tuy nhiên, trong mô hình của bạn (postgres tạo bảng, cong chỉ thao tác dữ liệu), điều này thường không cần thiết.
Kết luận:

Bộ quyền bạn đã cấp là rất tốt cho một ứng dụng web điển hình chỉ cần thao tác dữ liệu.

Bạn chỉ cần xem xét các quyền bổ sung nếu:

Bạn có các SEQUENCE đã tồn tại từ trước khi chạy ALTER DEFAULT PRIVILEGES.
Ứng dụng của bạn sử dụng VIEWS, FUNCTIONs, PROCEDUREs hoặc cần khả năng TRUNCATE.
Nếu không, bộ quyền hiện tại của bạn là đủ mạnh mẽ và an toàn.