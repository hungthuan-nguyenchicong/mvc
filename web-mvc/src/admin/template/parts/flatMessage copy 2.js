// web-mvc/src/admin/template/parts/flatMessage.js
import './flatMessage.scss';
function adminFlatMessage() {
    // return /* html */ `
    // <div id="messageContainer">Message</div>
    // `;
    document.addEventListener('crud-message', (e) => {
        const {message, type} = e.detail;
        render(message, type);
    })
}
// lắng nghe sự kiện
function render(message, type) {
    const flatElement = document.createElement('div');
    flatElement.className = `flatMessage ${type}`;
    flatElement.textContent = message;
    document.body.appendChild(flatElement);

    setTimeout(() => {
        flatElement.classList.add('show');
    }, 10);

    setTimeout(() => {
        flatElement.classList.remove('show');
        setTimeout(()=>{
            flatElement.remove();
        }, 500);
    }, 3000);
}
// phát sự kiện
function dispatchCrudMessage(message, type) {
    const event = new CustomEvent('crud-message', {
        detail: {message, type}
    });
    document.dispatchEvent(event);
}

export {adminFlatMessage, dispatchCrudMessage}