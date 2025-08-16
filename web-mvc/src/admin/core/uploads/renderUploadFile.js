// web-mvc/src/admin/core/uploads/renderUploadFile.js

function renderUploadFile() {
    return /* html */ `
        <button type="button" class="close-btn">X</button>
        <!-- Tab links -->
         <div class="tab">
            <button class="tablink active" data-tab="tabUpload">Upload</button>
            <button class="tablink" data-tab="tabGallery">Gallery</button>
         </div>
         <!-- tab content -->
          <div id="tabUpload" class="tabcontent active">
            <form id="upload">
                <h3>Upload Image</h3>
                <input type="file" name="file" accept="image/*"><br>
                <input type="text" name="alt" placeholder="ALT"><br>
                <button type="submit">Upload Image</button>
            </form>
          </div>
          <div id="tabGallery" class="tabcontent">
          <div id="galleryContainer"></div>
          <div id="gallerySidebar"></div>
          </div>
    `;
}

export { renderUploadFile }