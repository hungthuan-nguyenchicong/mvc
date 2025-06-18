// /views/ProductView.js

import BaseView from './BaseView.js';

export default class ProductView extends BaseView {
    constructor(elementId) {
        super(elementId); // Gọi constructor của BaseView
    }

    _generateMarkup(products) {
        if (!products || products.length === 0) {
            return '<p>Không có sản phẩm nào để hiển thị.</p>';
        }

        const productListHtml = products.map(product => `
            <li>
                <h3>${product.name}</h3>
                <p>Giá: ${product.price} VNĐ</p>
                <button data-id="${product.id}">Chi tiết</button>
            </li>
        `).join(''); // Dùng join('') để nối các phần tử mảng lại thành một chuỗi HTML

        return `
            <h2>Danh sách sản phẩm</h2>
            <ul>
                ${productListHtml}
            </ul>
        `;
    }

    // Bạn có thể thêm các phương thức xử lý sự kiện cụ thể cho ProductView tại đây
    // Ví dụ: handleProductClick(handler) {
    //     this.element.addEventListener('click', function(e) {
    //         if (e.target.matches('button')) {
    //             const productId = e.target.dataset.id;
    //             handler(productId);
    //         }
    //     });
    // }
}