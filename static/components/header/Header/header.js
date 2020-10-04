'use strict';

export function createHeader(application) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <header class="header">
            <img src="assets/google.png" class="logo">
            <input type="search" placeholder="Люди, мероприятия" class="searchinput">
            <img src="assets/pericon.svg" class="icon">
        </header>
    `;

    const icon = tmp.getElementsByClassName('icon')[0];
    icon.dataset.section = 'profile';

    application.appendChild(tmp.firstElementChild);
}