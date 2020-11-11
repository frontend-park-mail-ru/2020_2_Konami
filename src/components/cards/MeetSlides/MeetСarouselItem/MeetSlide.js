'use strict';

const template = require('./MeetSlideTemplate.pug');

export function createMeetSlide(data) {
    let startDate = new Date(data.card.startDate);
    const options = {weekday: 'long', month: 'long', day: 'numeric' };
    data.dateStr = startDate.toLocaleDateString('ru-RU', options);

    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}