// /views/BaseView.js

export default class BaseView {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Element with ID "${elementId}" not found.`);
        }
    }

    render(data) {
        // Phương thức này sẽ được ghi đè bởi các View con
        // để tạo ra HTML dựa trên dữ liệu.
        if (this.element) {
            this.element.innerHTML = this._generateMarkup(data);
        }
    }

    _generateMarkup(data) {
        // Phương thức nội bộ để tạo markup, cần được ghi đè.
        throw new Error('You must implement the _generateMarkup method in your child view.');
    }

    // Các phương thức chung khác có thể thêm vào đây, ví dụ:
    // addEventListener(eventType, selector, handler) { ... }
    // showLoadingSpinner() { ... }
    // hideLoadingSpinner() { ... }
}