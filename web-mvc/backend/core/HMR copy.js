// web-mvc/backend/core/HMR.js

function HMR(src = null) {
    
    if (import.meta.env.NODE_ENV === 'development') {
        return `<script type="module" src="http://localhost:4000/@vite/client"></script>

        ${fileHMR(src)}
        `;
    }
}
export {HMR}

function fileHMR(src = null) {
    if (!src) {
        return'';
    }
    return `<script type="module" src="http://localhost:4000${src}"></script>`;

}



