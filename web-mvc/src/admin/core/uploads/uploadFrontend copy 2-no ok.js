// web-mvc/src/admin/core/uploads/uploadFrontend.js
import './uploadFrontend.scss';
function uploadFrontend() {
    const tablinks = document.querySelectorAll('.tablink');
    const tabcontents = document.querySelectorAll('.tabcontent');

    document.addEventListener('tabUpload', (e) => {
        const newTabId = e.detail.dataId;
        activeTab(newTabId);
    });

    // button tab
    btnTab();

    // document.addEventListener('tabUpload', (e) => {

    // })
}

function btnTab() {
    const tablinks = document.querySelectorAll('.tablink');
    //const tabcontents = document.querySelectorAll('.tabcontent')

    tablinks.forEach(tablink => {
        tablink.addEventListener('click', () => {
            // xoa bo all active
            // tablinks.forEach(link => {
            //     link.classList.remove('active');
            // });
            // tabcontents.forEach(tabcontent => {
            //     tabcontent.classList.remove('active');
            // });
            // //console.log(1)
            // tablink.classList.add('active');
            // lay id
            const tabId = tablink.dataset.tab;
            const tabUploadEvent = new CustomEvent('tabUpload', {detail:{tabId:tabId}});
            document.dispatchEvent(tabUploadEvent);
            //console.log(tabId);
            //document.getElementById(tabId).classList.add('active')
        });
    });
}

function activeTab(currentTabId) {
    const currentBtnActive = document.querySelector('.tablink.active');
    const tablinks = document.querySelectorAll('.tablink');
    const tabcontents = document.querySelectorAll('.tabcontent');

    //const tablinks = document.querySelectorAll('.tablink');
    tablinks.forEach(tablink => {
        tablink.classList.remove('active');
    });
    tabcontents.forEach(tabcontent => {
        tabcontent.classList.remove('active');
    });
}

export {uploadFrontend}