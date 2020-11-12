'use strict';

const template = require('./UserCardTemplate.pug');

export function createUserCard(data) {
    const tmp = document.createElement('div');
    data.card.job = data.card.job.replace("\n", "<br/>");

    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}