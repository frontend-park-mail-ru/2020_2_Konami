'use strict';

const template = require('./UserCardTemplate.pug');

export function createUserCard(data) {
    const tmp = document.createElement('div');
    data.job = data.job.replace("\n", "<br/>");

    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}