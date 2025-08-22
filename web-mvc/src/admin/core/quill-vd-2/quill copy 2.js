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
    //counter.textContent = '';


    container.appendChild(editor);
    container.appendChild(counter);
}

function Counter(quill, options) {
    const container = document.querySelector(options.container);
    //console.log(container);
    quill.on(Quill.events.TEXT_CHANGE, () => {
        const text = quill.getText().trim();
        //console.log(text.length);
        if (options.unit === 'word') {
            container.innerHTML = text.split(/\s+/).length + ' "Words"'
        } else {
            container.innerHTML = text.length + ' characters'
        }
    });
}

Quill.register('modules/counter', Counter);


function quillInit() {
    const quill = new Quill('#editor', {
        modules: {
            counter: {
                container: '#counter',
                unit: 'word',
            }
        }
    });
}

export {quill}