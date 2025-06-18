// public/js/app.js

import ProductView from './views/ProductView.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('App.js loaded and DOM fully loaded!');

    // 1. Tạo dữ liệu mẫu (đây sẽ là dữ liệu từ Controller PHP gửi xuống)
    const productData = [
        { id: 1, name: 'Điện thoại XYZ', price: 10000000 },
        { id: 2, name: 'Laptop ABC', price: 25000000 },
        { id: 3, name: 'Chuột Gaming', price: 500000 }
    ];

    // 2. Khởi tạo ProductView, truyền vào ID của phần tử HTML mà View này sẽ quản lý
    const productListView = new ProductView('product-list-container');

    // 3. Render View với dữ liệu
    productListView.render(productData);

    // Ví dụ về cách xử lý sự kiện (nếu bạn có thêm phương thức handleProductClick trong ProductView)
    // productListView.handleProductClick((productId) => {
    //     console.log(`Clicked on product with ID: ${productId}`);
    //     // Gọi AJAX hoặc chuyển hướng để hiển thị chi tiết sản phẩm
    // });
});