// project/frontend/src/admin/dashboard.js
console.log('Admin Dashboard JavaScript loaded!');

document.addEventListener('DOMContentLoaded', () => {
    const adminAppDiv = document.getElementById('app-admin');
    if (adminAppDiv) {
        adminAppDiv.innerHTML = `
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            <button id="testAdminIndex">Fetch /admin/index</button>
            <button id="testAdminLoginGet">Fetch /admin/login (GET)</button>
            <button id="testAdminLoginPost">Send /admin/login (POST)</button>
        `;

        document.getElementById('testAdminIndex').addEventListener('click', async () => {
            const res = await fetch('/admin/index');
            const text = await res.text();
            alert('Response from /admin/index: ' + text);
        });

        document.getElementById('testAdminLoginGet').addEventListener('click', async () => {
            const res = await fetch('/admin/login');
            const text = await res.text();
            alert('Response from /admin/login (GET): ' + text);
        });

        document.getElementById('testAdminLoginPost').addEventListener('click', async () => {
            const res = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'password' })
            });
            const json = await res.json();
            alert('Response from /admin/login (POST): ' + JSON.stringify(json));
        });
    }
});