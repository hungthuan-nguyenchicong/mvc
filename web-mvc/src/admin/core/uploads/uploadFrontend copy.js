// web-mvc/src/admin/core/uploads/uploadFrontend.js
import './uploadFrontend.scss';
function uploadFrontend() {
    const tablinks = document.querySelectorAll('.tablink');
    const tabcontents = document.querySelectorAll('.tabcontent')

    tablinks.forEach(tablink => {
        tablink.addEventListener('click', () => {
            // xoa bo all active
            tablinks.forEach(link => {
                link.classList.remove('active');
            });
            tabcontents.forEach(tabcontent => {
                tabcontent.classList.remove('active');
            });
            //console.log(1)
            tablink.classList.add('active');
            // lay id
            const tabId = tablink.dataset.tab;
            //console.log(tabId);
            document.getElementById(tabId).classList.add('active')
        });
    });

    // document.addEventListener('tabUpload', (e) => {

    // })
}

export {uploadFrontend}