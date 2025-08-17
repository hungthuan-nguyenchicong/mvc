// web-mvc/src/admin/template/parts/sidebar.js
import './sidebar.scss'
function adminSidebar() {
    return /* html */ `
    <aside class="aside-sidebar">
        <ul>
            <li><a href="/admin/">DashBoard</a></li>
            <li><a href="/admin/abc">Test url: /admin/abc</a></li>

            <hr>
            <li><a href="/admin/?p=posts&action=index">Post Index</a></li>
            <li><a href="/admin/?p=posts&action=create">Post Create</a></li>
            <li><a href="/admin/?p=posts&action=show&id=1">Post Show id = 1</a></li>
            <li><a href="/admin/?p=posts&action=edit&id=1">Post Edit id = 1</a></li>
            <hr>
            <li><a href="/admin/?p=testWysiwyg&action=index">Test Wysiwyg</a></li>

        </ul>
    </aside>
    `;
}

export {adminSidebar}