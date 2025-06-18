## hoc

It sounds like you want to add an accordion-like functionality to your sidebar navigation, where clicking a main navigation item reveals a sub-menu. To do this, you'll need to modify both your HTML and JavaScript.

Here's how you can implement an accordion-style sidebar, allowing for nested list items that expand and collapse on click:

HTML Structure
First, you'll need to adjust your HTML to include nested ul elements for your sub-menus. Each main navigation item that should have a sub-menu will contain a ul with the class sub-menu.

HTML

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
CSS for Accordion Styling
Next, add some CSS to hide the sub-menus by default and provide a smooth transition when they expand.

CSS

<style>
    /* ... (your existing CSS) ... */

    .main-sidebar ul.nav .sub-menu {
        display: none; /* Hidden by default */
        list-style-type: none;
        padding-left: 20px; /* Indent sub-menu items */
        overflow: hidden; /* For smooth transition */
        transition: max-height 0.3s ease-out; /* Smooth collapse/expand */
        max-height: 0; /* Initial state for transition */
    }

    .main-sidebar ul.nav li.active > .sub-menu {
        display: block; /* Show when parent is active */
        max-height: 200px; /* Or a value large enough to contain content */
    }

    .main-sidebar ul.nav .sub-menu li a {
        padding: 8px 15px; /* Adjust padding for sub-menu items */
        background-color: #333; /* Different background for sub-menu */
    }

    .main-sidebar ul.nav .sub-menu li a:hover {
        background-color: #555;
    }
</style>
JavaScript for Accordion Functionality
Finally, modify your JavaScript to handle the clicks on the main navigation items, toggling the active class and thus expanding or collapsing the sub-menus.

JavaScript

<script>
    function tt(t) {
        console.log(t);
    }

    class SidebarNav {
        constructor() {
            this.navItems = document.querySelectorAll('ul.nav > li > a'); // Select direct children of ul.nav
            this.subMenus = document.querySelectorAll('ul.nav .sub-menu'); // Select all sub-menus
            this.clickLi();
        }

        clickLi() {
            this.navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    // Prevent default link behavior for main items with sub-menus
                    if (e.currentTarget.nextElementSibling && e.currentTarget.nextElementSibling.classList.contains('sub-menu')) {
                        e.preventDefault();
                    }

                    const parentLi = e.currentTarget.closest('li');

                    // If the clicked item's parent already has the 'active' class, remove it
                    // and collapse its sub-menu
                    if (parentLi.classList.contains('active')) {
                        parentLi.classList.remove('active');
                    } else {
                        // Remove 'active' from all other main items
                        document.querySelectorAll('ul.nav > li').forEach(li => {
                            li.classList.remove('active');
                        });
                        // Add 'active' to the clicked item's parent
                        parentLi.classList.add('active');
                    }
                });
            });

            // Handle clicks on sub-menu items to apply 'active' class
            this.subMenus.forEach(subMenu => {
                subMenu.querySelectorAll('li a').forEach(subItem => {
                    subItem.addEventListener('click', (e) => {
                        // Remove 'active' from all sidebar links (main and sub)
                        document.querySelectorAll('.main-sidebar ul.nav li a').forEach(navLink => {
                            navLink.classList.remove('active');
                        });
                        // Add 'active' to the clicked sub-menu item
                        e.currentTarget.classList.add('active');
                    });
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new SidebarNav();
    });
</script>
Explanation of Changes:
HTML Structure:
Main navigation items that have sub-menus now wrap their <ul> (with class="sub-menu") inside their <li>.
CSS Styling:
.sub-menu is display: none; by default and has max-height: 0; and overflow: hidden; for the collapse/expand animation.
li.active > .sub-menu sets display: block; and a max-height (adjust this to be larger than your largest sub-menu content) to reveal the sub-menu.
Added styles for sub-menu items to differentiate them.
JavaScript Logic:
this.navItems now specifically targets direct <a> children of ul.nav (ul.nav > li > a) to only select the main menu items.
When a main navigation item is clicked:
It checks if the clicked item has a sub-menu as its nextElementSibling. If it does, e.preventDefault() is called to stop the browser from navigating to the # anchor.
It toggles the active class on the parent <li> of the clicked <a>. This active class on the parent <li> is what the CSS uses to show/hide the sub-menu.
If a main item is clicked and it's already active, it will now collapse. If it's not active, it will expand, and any other open main menus will collapse.
Separate event listeners are added for sub-menu items (subMenu.querySelectorAll('li a')). This ensures that when a sub-menu item is clicked, its active class is applied correctly, while all other active links (main or sub) are deactivated.
With these changes, you'll have an accordion-style sidebar where clicking a main menu item expands or collapses its sub-menu.

## Áp dụng toggle() vào đoạn mã của bạn

const parentLi = e.currentTarget.closest('li');

// Bước 1: Gỡ bỏ class 'active' khỏi tất cả các mục chính khác
// Luôn thực hiện bước này để đảm bảo chỉ có 1 mục active
document.querySelectorAll('ul.nav > li').forEach(li => {
    // Đảm bảo không gỡ class 'active' khỏi chính parentLi nếu nó đã active
    // và chúng ta muốn tắt nó.
    // Hoặc chỉ gỡ khỏi các li khác parentLi.
    if (li !== parentLi) {
        li.classList.remove('active');
    }
});

// Bước 2: Bật/tắt class 'active' cho parentLi hiện tại
// Nếu parentLi đã active, nó sẽ bị tắt.
// Nếu parentLi chưa active, nó sẽ được bật.
parentLi.classList.toggle('active');