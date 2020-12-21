'use strict';

export function createListUser(label) { // , info) {
    const div = document.createElement('div');
    // div.classList.add('list_user');
    // div.id = 'listUser' + label.id;
    div.innerHTML = `
        <div class="list_user" id="listUser${label.id}">
            <div class="list_user__icon_wrapper">
            <a style="text-decoration:none" href="/profile?userId=${label.id}">
                <img class="list_user__icon" src="${label.imgSrc}">
            </a>
            <span class="online_icon"></span>
        </div>
        <div class="list_user__user_info">
            <a class="icon-with-text__link bold" href="/profile?userId=${label.id}">
                ${label.name}
            </a>
            
            <p>Online</p>
    </div>
        </div>
    `
    return div.firstElementChild;
}
