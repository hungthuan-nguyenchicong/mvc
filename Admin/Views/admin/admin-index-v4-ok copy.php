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
        <?php 
        
        require_once root().'Core/LoadContent.php';
        new LoadContent(); ?>
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
            this.linkItems = document.querySelectorAll ('nav.sidebar-nav a');
            this.clickLink();

        }

        clickLink() {
            this.linkItems.forEach(link => {
                link.addEventListener('click', (e)=>{
                    //e.preventDefault();
                    this.linkItems.forEach(link =>{
                        link.classList.remove('active');
                        link.classList.remove('link-parent');
                    });
                    if (e.currentTarget.classList.contains('sub-menu-link')) {
                        const liParent = e.currentTarget.parentNode.parentNode.parentNode;
                        const linkParent = liParent.querySelector('a');
                        linkParent.classList.add('link-parent');
                    }
                    e.currentTarget.classList.toggle('active');
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', ()=>{
        new SidebarNav();
    });

</script>