
<h3>admin index</h3>

<div class="main">
    <div class="main-sidebar">
        <ul class="nav">
            <li>
                <a href="#1">Main Item 1</a>
                <ul class="sub-menu">
                    <li><a href="#1-1">Sub Item 1.1</a></li>
                    <li><a href="#1-2">Sub Item 1.2</a></li>
                </ul>
            </li>
            <li>
                <a href="#2">Main Item 2</a>
                <ul class="sub-menu">
                    <li><a href="#2-1">Sub Item 2.1</a></li>
                    <li><a href="#2-2">Sub Item 2.2</a></li>
                </ul>
            </li>
            <hr>
            <li><a href="/admin/logout/">Logout</a></li>
        </ul>
    </div>
    <div class="main-content">
        <?php new LoadContent(); ?>
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
    .main-sidebar ul.nav .sub-menu {
        display: none;
        list-style-type: none;
    }
    .main-sidebar ul.nav li.active > .sub-menu {
        display: block;
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
            this.navItems = document.querySelectorAll('ul.nav > li > a');
            this.clickLi();
        }

        clickLi() {
            this.navItems.forEach(item => {
                item.addEventListener('click', (e)=>{
                    const clickedLink = e.currentTarget;
                    const parentLi = e.currentTarget.closest('li');
                    //prevent default link behaviorfor main items with sub-menu
                    if (e.currentTarget.nextElementSibling && e.currentTarget.nextElementSibling.classList.contains('sub-menu')) {
                        e.preventDefault();
                    }
                    
                    // If the parent <li> already has the 'active' class (meaning it's currently open),
                    // remove 'active' from both the <li> and the <a> to close it.
                    if (parentLi.classList.contains('active')) {
                        parentLi.classList.remove('active');
                        clickedLink.classList.remove('active');
                    } else {
                        // Remove 'active' from ALL other main <li> elements
                        document.querySelectorAll('ul.nav > li').forEach(li => {
                            li.classList.remove('active');
                        });

                        // Remove 'active' from ALL other main <a> elements
                        // Since this.navItems already selects all 'ul.nav > li > a' elements,
                        // we can iterate over it to remove the active class from all of them.
                        this.navItems.forEach(link => {
                            link.classList.remove('active');
                        });

                        // Now, add 'active' to the currently clicked <li> and its <a>.
                        parentLi.classList.add('active');
                        clickedLink.classList.add('active');
                    }
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', ()=> {
        new SidebarNav();
    });
</script>