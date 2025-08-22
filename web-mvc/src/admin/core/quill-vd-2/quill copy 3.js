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
    const container = document.querySelector(options.container);
    quill.on(Quill.events.TEXT_CHANGE, () => {
      const text = quill.getText();
      if (options.unit === 'word') {
        container.innerText = text.split(/\s+/).length + ' words';
      } else {
        container.innerText = text.length + ' characters';
      }

    });
  }

  calculate() {
    const text = this.quill.getText();

    return this.options.unit === 'word' ?
      text.split(/\s+/).length :
      text.length;
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