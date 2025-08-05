// web-mvc/src/admin/template/pages/posts/post-index.js
function adminPostIndex() {
    return /* html */ `
    <h2>Post Index</h2>
    `;
}
async function requestServer() {
    const response = await fetch('/admin/api/?TestController@index', {
        //method: 'POST',
    });
    const result = await response.json();
    console.log(result)
}
requestServer()
// console.log(1)
// const contentElement = document.querySelector('.content');
// contentElement.innerHTML = adminPostIndex();
export {adminPostIndex}