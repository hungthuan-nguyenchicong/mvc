
<h3>admin index</h3>

<div class="main">
    <div class="main-sidebar">
        <ul class="nav">
            <li><a href="#1">#1</a></li>
            <li><a href="#2">#2</a></li>
            <hr>
            <li><a href="/admin/logout/">Logout</a></li>
        </ul>
    </div>
    <div class="main-content">
        abc
    </div>
</div>

<style>
    .main {
        box-sizing: border-box;
        display: flex;
    }
    /* --- Cải thiện tổng thể cho danh sách điều hướng --- */

    .main-sidebar {
        width: 20%;
        background-color: #212529; /* Màu nền đen đậm cho toàn bộ sidebar */
        color: #f8f9fa; /* Màu chữ mặc định sáng cho sidebar */
        padding-top: 10px; /* Khoảng cách trên cùng */
        box-shadow: 2px 0 5px rgba(0,0,0,0.5); /* Thêm đổ bóng nhẹ để nổi bật */
    }

    .main-sidebar ul.nav {
        list-style-type: none;
        margin: 0; /* Loại bỏ margin mặc định của ul */
        padding: 0; /* Loại bỏ padding mặc định của ul */
    }

    /* --- Cải thiện cho từng mục li --- */

    ul.nav li {
        cursor: pointer;
        margin-bottom: 5px; /* Khoảng cách giữa các mục li */
        transition: background-color 0.3s ease; /* Hiệu ứng chuyển động mượt khi hover */
    }

    /* Hiệu ứng hover cho li */
    ul.nav li:hover {
        background-color: #343a40; /* Màu nền khi di chuột qua (tối hơn một chút so với nền sidebar) */
    }

    /* --- Cải thiện cho thẻ a bên trong li --- */

    .nav li a {
        display: block; /* Quan trọng: làm cho thẻ a chiếm toàn bộ chiều rộng của li, dễ click hơn */
        padding: 10px 15px; /* Thêm padding để tạo khoảng trống bên trong liên kết */
        text-decoration: none; /* Loại bỏ gạch chân mặc định của liên kết */
        color: #ced4da; /* Màu chữ cho liên kết (màu xám nhạt để dễ đọc trên nền tối) */
        font-weight: 500; /* Làm chữ đậm hơn một chút */
        transition: color 0.3s ease; /* Hiệu ứng chuyển động mượt khi hover */
    }

    /* Hiệu ứng hover cho thẻ a (tùy chọn, có thể bỏ qua nếu đã có hover cho li) */
    /* Cần điều chỉnh màu hover của a cho phù hợp với tông tối */
    .nav li a:hover {
        color: #ffffff; /* Màu chữ trắng tinh khi di chuột qua */
    }

    /* --- Thêm kiểu cho liên kết đang hoạt động (active link) --- */

    .nav li.active {
        background-color: #007bff; /* Màu nền cho mục đang hoạt động (có thể giữ màu xanh lam để nổi bật) */
    }

    .nav li.active a {
        color: #fff; /* Màu chữ trắng cho mục đang hoạt động */
        font-weight: bold; /* Làm chữ đậm hơn */
    }

    /* Đảm bảo rằng mục active vẫn giữ màu nền và chữ khi hover */
    .nav li.active:hover {
        background-color: #0069d9; /* Màu nền hơi tối hơn khi hover trên mục active */
        /* Có thể giữ nguyên #007bff nếu muốn nó không đổi màu khi hover */
    }
    /* Hoặc có thể áp dụng thêm hiệu ứng đổ bóng hoặc border để mục active nổi bật hơn */
    .nav li.active {
        background-color: #007bff;
        border-left: 3px solid #ffc107;  /* Ví dụ thêm border bên trái màu vàng */
    }


    /* --- Xử lý đường gạch ngang hr --- */
    /* Để đường gạch ngang trông đẹp hơn, bạn có thể định kiểu lại thẻ hr */
    .nav hr {
        border: none; /* Bỏ border mặc định */
        border-top: 1px solid #495057; /* Thêm đường kẻ mỏng màu xám đậm hơn */
        margin: 10px 0; /* Khoảng cách trên và dưới */
    }
    .main-content {
        width: 80%;
        margin-left: 2%;
    }
</style>

<script>
    function tt(t) {
        console.log(t);
    }
    class SidebarNav {
        constructor() {
            this.navItems = document.querySelectorAll('ul.nav li');
            // this.clickLi();
        }

        clickLi() {
            this.navItems.forEach(item => {
                item.addEventListener('click', (e)=>{
                    const link = e.currentTarget.querySelector('a');
                    this.navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                     });

                    // Sau khi xóa tất cả, mới thêm vào item hiện tại
                    item.classList.add('active');
                    if (link && !link.contains(e.target)) {
                        link.click();
                        
                    }
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', ()=> {
        new SidebarNav();
    });
</script>