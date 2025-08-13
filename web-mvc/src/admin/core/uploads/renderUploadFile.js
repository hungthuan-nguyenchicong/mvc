// web-mvc/src/admin/core/uploads/renderUploadFile.js

function renderUploadFile() {
    return /* html */ `
        <button type="button" class="close-btn">X</button>
        <form id="upload">
            <h3>Upload Image</h3>
            <input type="file" name="file" accept="image/*"><br>
            <button type="submit">Upload Image</button>
        </form>
    `;
}

export {renderUploadFile}