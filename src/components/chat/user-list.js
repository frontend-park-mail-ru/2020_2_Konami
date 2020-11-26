'use strict';

export function createListUser(label, info) {
    const div = document.createElement('div');
    // div.classList.add('list_user');
    // div.id = 'listUser' + label.id;
    div.innerHTML = `
        <div class="list_user" id="listUser${label.id}">
            <img class="list_user__icon" 
            src="${label.imgSrc}">
            <a class="icon-with-text__link bold" href="/profile?userId=${label.id}">
                ${label.name}
            </a>
        </div>
    `
    return div.firstElementChild;
}
