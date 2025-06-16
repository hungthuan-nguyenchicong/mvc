
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
    .main-sidebar {
        width: 25%;
        background-color: black;
        box-shadow: 2px 0 5px #898989
    }
    .main-content {
        width: 75%;
        margin-left: 2%;
    }
    .main-sidebar ul.nav {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .main-sidebar ul.nav hr {
        border: 1px solid #898989;
        margin: 2px 0;
    }
    .main-sidebar ul.nav li a {
        display: block;
        color: white;
        padding: 10px 15px;
        text-decoration: none;
        transition: background-color 0.3s ease;
    }
    .main-sidebar ul.nav li a:hover {
        background-color: #797979;
    }
    .main-sidebar ul.nav li a.active {
        background-color: #007bff;
        border-left: 3px solid #ffc107;
    }
</style>

<script>
    function tt(t) {
        console.log(t);
    }
    class SidebarNav {
        constructor() {
            this.navItems = document.querySelectorAll('ul.nav li a');
            this.clickLi();
        }

        clickLi() {
            this.navItems.forEach(item => {
                item.addEventListener('click', (e)=>{
                    // Bước 1: Xóa lớp 'active' khỏi TẤT CẢ các mục
                    this.navItems.forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                    e.currentTarget.classList.add('active');
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', ()=> {
        new SidebarNav();
    });
</script>