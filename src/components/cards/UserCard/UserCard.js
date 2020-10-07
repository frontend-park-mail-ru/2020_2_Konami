'use strict';

export function createUserCard(data) {
    const tmp = document.createElement('div');
    data.job = data.job.replace("\n", "<br/>");

    tmp.innerHTML = window.UserCardTemplate(data);

    return tmp.firstElementChild;
}