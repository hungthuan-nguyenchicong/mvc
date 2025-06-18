<main class="page-layout">
    <aside class="sidebar">
        <nav class="sidebar-nav">
            <ul class="main-menu">
                <li>
                    <a href="#" class="main-menu-link">Main Item 1</a>
                    <ul class="sub-menu">
                        <li><a href="#" class="sub-menu-link">Sub Item 1.1</a></li>
                        <li><a href="#" class="sub-menu-link">Sub Item 1.2</a></li>
                    </ul>
                </li>
                <li>
                    <a href="/admin/?TestController@index" class="main-menu-link">Test Controller Index</a>
                    <ul class="sub-menu">
                        <li><a href="/admin/?TestController@show&id=1" class="sub-menu-link">Test Controller Show Id =1</a></li>
                        <li><a href="/admin/?TestController@testDatabase" class="sub-menu-link">Test Controller testDatabase</a></li>
                    </ul>
                </li>
                <hr>
                <li class="menu-item-logout"><a href="/admin/logout/" class="main-menu-link">Logout</a></li>
            </ul>
        </nav>
    </aside>
    <div class="content-area">
        <?php new LoadContent(); ?>
    </div>
</main>
<style>
    .page-layout {
        box-sizing: border-box;
        display: flex;
    }
    .sidebar {
        width: 25%;
        background-color: #2c3e50; /* Darker, modern navy/charcoal */
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2); /* Softer shadow */
    }
    .content-area {
        width: 75%;
        margin-left: 2%;
    }
    .main-menu {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .sub-menu {
        list-style-type: none;
        padding-left: 15px;
    }
    .main-menu hr {
        border: 1px solid #4a637d; /* Lighter shade of sidebar background */
        margin: 2px 0;
    }

    .main-menu-link, .sub-menu-link {
        display: block;
        color: #ecf0f1; /* Light grey/off-white for text */
        padding: 10px 15px;
        text-decoration: none;
        transition: background-color 0.3s ease, color 0.3s ease; /* Add color transition */
    }
    .main-menu-link:hover, .sub-menu-link:hover {
        background-color: #34495e; /* Slightly lighter than sidebar, darker than normal */
        color: #ffffff; /* Pure white on hover for contrast */
    }
    .sidebar-nav a.active {
        background-color: #2793db; /* A vibrant blue for active state */
        border-left: 3px solid #2ecc71; /* A warm yellow for accent */
        color: #ffffff; /* Ensure text is white on active */
    }
    .sidebar-nav a.link-parent {
        background-color: #225c83; /* A slightly darker shade of the active blue for parent */
        border-left: 3px solid #f1c40f; /* A fresh green for parent accent */
        color: #ffffff; /* Ensure text is white for parent */
    }

</style>
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
            //tt(`Current URL on load: ${currentUrl}`); // Để debug

            this.linkItems.forEach(link => {
                const linkHref = link.getAttribute('href');
                
                // So sánh href của liên kết với URL hiện tại
                if (linkHref === currentUrl) {
                    link.classList.add('active');
                    //tt(`Matched link: ${linkHref}`); // Để debug

                    // Nếu liên kết khớp là sub-menu, thì cũng cần active parent của nó
                    if (link.classList.contains('sub-menu-link')) {
                        const liParent = link.closest('ul').closest('li');
                        if (liParent) {
                            const linkParent = liParent.querySelector('a.main-menu-link');
                            if (linkParent) {
                                linkParent.classList.add('link-parent');
                                //tt(`Activated parent for: ${linkHref}`); // Để debug
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