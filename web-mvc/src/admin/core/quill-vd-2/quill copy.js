// web-mvc/src/admin/core/quill/quill.js
import './quill.scss';
import Quill from 'quill';
function quill(container) {
    //console.log(1);
    quillRender(container);
    // quill init
    quillInit();
}

function quillRender(container) {
    //console.log(container);
    const editor = document.createElement('div');
    editor.id = 'editor';

    // const 
    const counter = document.createElement('div');
    counter.id = 'counter';
    counter.textContent = '0';


    container.appendChild(editor);
    container.appendChild(counter);
}

function Counter(quill, options) {
    const container = document.querySelector('#counter');
    quill.on(Quill.events.TEXT_CHANGE, () => {
        const text = quill.getText().trim();
        //console.log(text.length);
        if (text) {
            container.innerText = text.split(/\s+/).length;
        }
    });
    //Quill.register('modules/counter', Counter);
}
// ⚠️ This is the correct placement for the registration call
Quill.register('modules/counter', Counter);


function quillInit() {
    // ⚠️ This is the correct placement for the registration call
    //Quill.register('modules/counter', Counter);
    const quill = new Quill('#editor', {
        modules: {
            counter: true,
        }
    });
}

export {quill}