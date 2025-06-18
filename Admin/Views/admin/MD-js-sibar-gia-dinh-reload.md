## hoc

Bạn đang tìm cách để JavaScript có thể "bắt" URL sau khi trang đã reload (do click vào href thông thường) và sau đó sử dụng URL đó để giả lập trạng thái "không reload" trong sidebar. Điều này là hoàn toàn khả thi!

Cái bạn cần là một đoạn JavaScript chạy khi trang tải xong (sau khi reload), nó sẽ đọc URL hiện tại từ thanh địa chỉ của trình duyệt, và sau đó tìm liên kết tương ứng trong sidebar để đánh dấu nó là "active". Điều này sẽ tạo ra một trải nghiệm liền mạch cho người dùng, dù trang có bị reload đi chăng nữa, trạng thái sidebar vẫn được duy trì.

Sửa đổi JavaScript của bạn
Tôi sẽ thêm một phương thức handleInitialLoad() vào lớp SidebarNav và gọi nó trong constructor. Phương thức này sẽ đọc window.location.href (hoặc window.location.pathname + window.location.search) để xác định URL hiện tại và sau đó tìm liên kết phù hợp trong sidebar để thêm class active và link-parent.

HTML

<script>
    function tt(t) {
        console.log(t);
    }

    class SidebarNav {
        constructor() {
            this.linkItems = document.querySelectorAll('nav.sidebar-nav a');
            this.clickLink();
            // *** Thêm dòng này để xử lý trạng thái khi trang tải lần đầu hoặc sau reload ***
            this.handleInitialLoad(); 
        }

        clickLink() {
            this.linkItems.forEach(link => {
                link.addEventListener('click', (e) => {
                    // **Quan trọng:** Nếu bạn muốn trang reload, đừng dùng e.preventDefault();
                    // e.preventDefault(); 
                    
                    // Xóa tất cả các class active/link-parent hiện có
                    this.linkItems.forEach(item => {
                        item.classList.remove('active');
                        item.classList.remove('link-parent');
                    });
                    
                    // Thêm class 'active' cho liên kết hiện tại
                    e.currentTarget.classList.add('active');

                    // Nếu là sub-menu-link, thêm class 'link-parent' cho menu chính
                    if (e.currentTarget.classList.contains('sub-menu-link')) {
                        const liParent = e.currentTarget.closest('ul').closest('li'); // Tìm li cha của menu chính
                        if (liParent) {
                            const linkParent = liParent.querySelector('a.main-menu-link');
                            if (linkParent) {
                                linkParent.classList.add('link-parent');
                            }
                        }
                    }
                    
                    // Sau khi click, trình duyệt sẽ tự động reload do href
                    // Logic handleInitialLoad() sẽ lo phần active sau khi reload
                });
            });
        }

        // *** Phương thức mới để xử lý trạng thái sidebar khi tải trang ***
        handleInitialLoad() {
            // Lấy toàn bộ URL hiện tại (bao gồm cả pathname và query string)
            const currentUrl = window.location.pathname + window.location.search;
            tt(`Current URL on load: ${currentUrl}`); // Để debug

            this.linkItems.forEach(link => {
                const linkHref = link.getAttribute('href');
                
                // So sánh href của liên kết với URL hiện tại
                if (linkHref === currentUrl) {
                    link.classList.add('active');
                    tt(`Matched link: ${linkHref}`); // Để debug

                    // Nếu liên kết khớp là sub-menu, thì cũng cần active parent của nó
                    if (link.classList.contains('sub-menu-link')) {
                        const liParent = link.closest('ul').closest('li');
                        if (liParent) {
                            const linkParent = liParent.querySelector('a.main-menu-link');
                            if (linkParent) {
                                linkParent.classList.add('link-parent');
                                tt(`Activated parent for: ${linkHref}`); // Để debug
                            }
                        }
                    }
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new SidebarNav();
    });

</script>
Giải thích về những thay đổi:
e.preventDefault(); bị loại bỏ (hoặc comment lại): Điều này cho phép thẻ <a> thực hiện hành vi mặc định của nó là reload lại trang khi được nhấp.
handleInitialLoad() Method:
Phương thức này được gọi trong constructor() của SidebarNav, đảm bảo nó chạy ngay sau khi DOM của trang được tải hoàn chỉnh (khi DOMContentLoaded kích hoạt).
Nó lấy window.location.pathname + window.location.search để có được URL đầy đủ hiện tại của trình duyệt, bao gồm cả query string (ví dụ: /admin/?TestController@show&id=1).
Nó lặp qua tất cả các liên kết trong sidebar (this.linkItems).
Đối với mỗi liên kết, nó so sánh href của liên kết đó với currentUrl.
Nếu tìm thấy một sự trùng khớp, nó sẽ thêm class active vào liên kết đó và, nếu cần, thêm class link-parent vào liên kết chính của menu cha.
Logic closest('ul').closest('li'): Được cải thiện để tìm đúng phần tử <li> cha cho main-menu-link khi một sub-menu-link được kích hoạt.
Cách hoạt động khi người dùng tương tác:
Người dùng click vào <a href="/admin/?TestController@show&id=1" ...>
JavaScript clickLink() xử lý sự kiện:
Nó xóa tất cả các class active/link-parent cũ.
Nó thêm active và link-parent (nếu có) trước khi trang reload. Điều này có thể tạo ra một flash rất nhanh với trạng thái active đúng trước khi trang bị xóa.
Vì e.preventDefault() không được gọi, trình duyệt bắt đầu quá trình reload.
Trình duyệt gửi yêu cầu mới đến /admin/?TestController@show&id=1.
PHP xử lý yêu cầu, render lại toàn bộ trang (bao gồm cả sidebar và content-area với nội dung mới từ TestController@show).
Trình duyệt tải xong trang mới.
Sự kiện DOMContentLoaded kích hoạt.
Constructor của SidebarNav chạy, gọi handleInitialLoad().
handleInitialLoad() đọc URL hiện tại (/admin/?TestController@show&id=1), tìm liên kết tương ứng trong sidebar, và áp dụng lại class active và link-parent.
Kết quả là, dù trang có bị reload, sidebar của bạn vẫn sẽ "ghi nhớ" và hiển thị liên kết chính xác là đang được chọn, tạo ra ảo giác rằng JavaScript vẫn đang "thực thi" và duy trì trạng thái.

