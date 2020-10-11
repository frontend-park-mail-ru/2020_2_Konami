'use strict';

import {placeAuthModal} from "../../auth/ModalDialog/ModalDialog.js";

export function createHeader(application) {
    const headerWrapper = document.createElement('div');
    headerWrapper.innerHTML = `
        <header class="header">
            <img src="assets/google.png" class="logo">
            <input type="search" placeholder="Люди, мероприятия" class="searchinput">
            <img src="assets/pericon.svg" class="icon">
        </header>
    `;

    const icon = headerWrapper.getElementsByClassName('icon')[0];
    icon.dataset.section = 'profile';
    application.appendChild(headerWrapper.firstElementChild);

    placeAuthModal();
}
