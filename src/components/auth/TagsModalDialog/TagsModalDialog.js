import {applyOptionsTo} from "../utils.js";

export function createModalDialog() {
    const modalBackground = document.createElement('div');
    applyOptionsTo(modalBackground, {id:'modalTags', classList: ['modal']});

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    modalContent.innerHTML = '<span class="close">&times;</span>\n';

    for (let i = 0; i < 10; i++) {
        let lbl = document.createElement('label');
        let input = document.createElement('input');
        input.classList.add('btnLike');
        input.type = 'checkbox';
        input.name = 'tags';
        input.value = 'randomTag' + i;

        let span = document.createElement('span');
        span.textContent = 'randomTag';

        lbl.appendChild(input);
        lbl.appendChild(span);

        modalContent.appendChild(lbl);
    }

    modalBackground.appendChild(modalContent);
    return modalBackground;
}

