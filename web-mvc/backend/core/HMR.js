// web-mvc/backend/core/HMR.js

// function HMR(src = null) {
    
//     if (import.meta.env.NODE_ENV === 'development') {
//         return `<script type="module" src="http://localhost:4000/@vite/client"></script>

//         ${fileHMR(src)}
//         `;
//     }
// }
// export {HMR}

// function fileHMR(src = null) {
//     if (!src) {
//         return'';
//     }
//     return `<script type="module" src="http://localhost:4000${src}"></script>`;

// }

// function HMR(src = null) {
//     const vitedev = '/@vite/client';
//     //let srcFile = src;
//     const host = 'http://localhost:4000';
//     if (src) {
//         return `
//         <script type="module" src="${host}${vitedev}"></script>
//         <script type="module" src="${host}${src}"></script>`;
//     }
//     return `<script type="module" src="${host}${vitedev}"></script>`;
// }

// export {HMR}

//console.log(HMR())

// web-mvc/backend/core/HMR.js

function HMR(src = null) {
    const vitedev = '/@vite/client';
    const host = 'http://localhost:4000'; // Đảm bảo Vite dev server chạy trên cổng này

    let scripts = '';
    // Thẻ script cho Vite client luôn cần để HMR hoạt động
    scripts += `<script type="module" src="${host}${vitedev}"></script>\n`;

    // Thêm script của ứng dụng frontend của bạn
    if (src) {
        scripts += `<script type="module" src="${host}${src}"></script>`;
    }

    return scripts;
}

export { HMR };



