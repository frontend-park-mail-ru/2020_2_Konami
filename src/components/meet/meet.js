'use strict';

const template = require('./MeetTemplate.pug');

export function createMeetPage(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}