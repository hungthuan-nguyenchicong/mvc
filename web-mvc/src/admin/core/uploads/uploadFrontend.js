// web-mvc/src/admin/core/uploads/uploadFrontend.js
import './uploadFrontend.scss';
//import { uploadGallery } from './uploadGallery';
function uploadFrontend() {
    //const tablinks = document.querySelectorAll('.tablink');
    //const tabcontents = document.querySelectorAll('.tabcontent');

    document.addEventListener('tabUpload', (e) => {
        const newTabId = e.detail.tabId;
        activeTab(newTabId);
        //uploadGallery();
    });

    // button tab
    btnTab();
    //uploadGallery();
    // document.addEventListener('tabUpload', (e) => {
    //uploadGallery();
    // })
}

function btnTab() {
    const tablinks = document.querySelectorAll('.tablink');
    //const tabcontents = document.querySelectorAll('.tabcontent')

    tablinks.forEach(tablink => {
        tablink.addEventListener('click', () => {
            // click current link
            // const currentClickBtn = e.target.getAttribute('data-tab');
            // console.log(currentClickBtn)
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

            // Thêm điều kiện kiểm tra: chỉ xử lý khi nút click không có class 'active'
            if (!tablink.classList.contains('active')) {
                const tabId = tablink.dataset.tab;
                const tabUploadEvent = new CustomEvent('tabUpload', {detail:{tabId:tabId}});
                document.dispatchEvent(tabUploadEvent);
            }

            //console.log(tabId);
            //document.getElementById(tabId).classList.add('active')
            
        });
    });
    //uploadGallery();
}

// function activeTab(currentTabId) {
//     //const currentBtnActive = document.querySelector('.tablink.active');
//     const currentTablinkActive = document.querySelector('.tablink.active');
//     const currentTabcontentActive = document.querySelector('.tabcontent.active')
//     const tablinks = document.querySelectorAll('.tablink');
//     const tabcontent = document.getElementById(`${currentTabId}`);

//     // remove the active class from any current active
//     if (currentTablinkActive) {
//         currentTablinkActive.classList.remove('active');
//     }
//     if (currentTabcontentActive) {
//         currentTabcontentActive.classList.remove('active');
//     }
//     //const tablinks = document.querySelectorAll('.tablink');
//     tablinks.forEach(tablink => {
//         const tabId = tablink.getAttribute('data-tab');
//         console.log(tabId)
//         if (currentTabId === tabId) {
//             tablink.classList.add('active');
//             tabcontent.classList.add('active');
//         }
//         //tablink.classList.remove('active');
//     });
//     // tabcontents.forEach(tabcontent => {
//     //     tabcontent.classList.remove('active');
//     // });
// }
function activeTab(currentTabId) {
    //console.log(currentTabId)
    const currentTablinkActive = document.querySelector('.tablink.active');
    const currentTabcontentActive = document.querySelector('.tabcontent.active');
    const newTablink = document.querySelector(`.tablink[data-tab="${currentTabId}"]`);
    const newTabcontent = document.getElementById(currentTabId);

    // Remove the active class from any current active elements
    if (currentTablinkActive) {
        currentTablinkActive.classList.remove('active');
    }
    if (currentTabcontentActive) {
        currentTabcontentActive.classList.remove('active');
    }

    // Add the active class to the new elements
    if (newTablink) {
        newTablink.classList.add('active');
    }
    if (newTabcontent) {
        newTabcontent.classList.add('active');
    }
}

export {uploadFrontend}