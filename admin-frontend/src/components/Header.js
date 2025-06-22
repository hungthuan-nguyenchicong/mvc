// ./src/components/Header.js:
import './Header.scss';
export class Header {
  constructor() {
    // Khởi tạo các thuộc tính nếu cần
  }

  render() {
    const header = document.createElement('header');
    header.innerHTML = /* html */ `
      <h1>Chào mừng bạn đến với trang quản trị</h1>
    `;
    return header;
  }
}