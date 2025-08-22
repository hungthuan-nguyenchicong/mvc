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

class Counter {
    constructor(quill, options) {
        //console.log(1);
        this.quill = quill;
        this.options = options;
        this.container = document.querySelector(options.container);
        //console.log(this.container)
        quill.on(Quill.events.TEXT_CHANGE, this.update.bind(this));
    }

    calculate() {
        const text = this.quill.getText();
        //console.log(text);
        if (this.options.unit === 'word') {
            const trimmed = text.trim();
            return trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
        } else {
            return text.length;
        }
    }

    update() {
        const length = this.calculate();
        let label = this.options.unit;
        if (length !== 1) {
            label += 's';
        }
        this.container.innerHTML = `${length} "${label}"`;
    }
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