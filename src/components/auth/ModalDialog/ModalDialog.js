import {applyOptionsTo} from "../utils.js";
import {createLoginFormLayout} from "../Form/FormLayout.js";

export function createModalDialog(props, contentElement) {
    const modalBackground = document.createElement('div');
    applyOptionsTo(modalBackground, {...props});

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    modalContent.innerHTML = '<span class="close">&times;</span>\n';

    modalContent.append(...contentElement);
    modalBackground.appendChild(modalContent);
    return modalBackground;
}

export function placeAuthModal() {
    let modal = document.getElementById("authModal");

    const header = document.getElementsByClassName('header')[0];
    if (modal !== null) {
        header.removeChild(modal);
    }

    const loginForm = createLoginFormLayout(header);

    modal = createModalDialog({id:'authModal', classList: ['modal']}, [loginForm.form]);
    header.appendChild(modal);
}

