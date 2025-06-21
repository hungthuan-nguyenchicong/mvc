// app.js
function tt(t) {
    console.log(t);
}

function getHomePageContent() {
    return `
        <h1>Chào mừng bạn đến với SPA của tôi!</h1>
        <p>Đây là trang chủ. Bạn có thể điều hướng đến các trang khác bằng cách nhấp vào các liên kết ở trên.</p>
        <p>Ứng dụng này chỉ sử dụng Vanilla JavaScript ở phía frontend.</p>
    `;
}

function getAboutPageContent() {
    return `
        <h1>Giới thiệu</h1>
        <p>Đây là một ví dụ đơn giản về ứng dụng một trang (SPA) được xây dựng hoàn toàn bằng HTML, CSS và JavaScript.</p>
        <p>Mục đích là để minh họa cách định tuyến và hiển thị nội dung mà không cần tải lại trang.</p>
    `;
}

function getContactPageContent() {
    return `
        <h1>Liên hệ</h1>
        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ:</p>
        <ul>
            <li>Email: example@example.com</li>
            <li>Điện thoại: 123-456-7890</li>
        </ul>
    `;
}

function getNotFoundPageContent() {
    return `
        <h1>404 - Không tìm thấy trang</h1>
        <p>Trang bạn đang tìm kiếm không tồn tại.</p>
        <p>Vui lòng kiểm tra lại URL hoặc quay lại <a href="#home">Trang chủ</a>.</p>
    `;
}
// router
function handleRouting() {
    // Lấy hash từ URL (ví dụ: "#home" -> "home")
    const hash = window.location.hash.substring(1); // .substring(1) để bỏ ký tự '#'

    let content = '';

    switch (hash) {
        case 'home':
        case '': // Nếu không có hash hoặc hash rỗng, mặc định là trang chủ
            content = getHomePageContent();
            break;
        case 'about':
            content = getAboutPageContent();
            break;
        case 'contact':
            content = getContactPageContent();
            break;
        default: // Nếu hash không khớp với bất kỳ trang nào
            content = getNotFoundPageContent();
            break;
    }

    // Cập nhật nội dung của phần tử 'app'
    app.innerHTML = content;
}
//handleRouting();
window.addEventListener('hashchange', handleRouting);
