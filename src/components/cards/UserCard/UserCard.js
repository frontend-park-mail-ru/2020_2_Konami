'use strict';

const template = require('./UserCardTemplate.pug');
const templateNew = require('./UserCardTemplateNew.pug')

export function createUserCard(data) {
    const tmp = document.createElement('div');
    data.job = data.job.replace("\n", "<br/>");

    tmp.innerHTML = templateNew(data);

    return tmp.firstElementChild;
}