'use strict';

const template = require('./MeetSlideTemplate.pug');
const mobileTemplate = require('./MeetSlideMobileTemplate.pug');

export function createSlide(data, isMobile) {
    let startDate = new Date(data.card.startDate);
    const options = {weekday: 'long', month: 'long', day: 'numeric' };
    data.dateStr = startDate.toLocaleDateString('ru-RU', options);

    const tmp = document.createElement('div');
    if (isMobile) {
        tmp.innerHTML = mobileTemplate(data);
    } else {
        tmp.innerHTML = template(data);
    }

    return tmp.firstElementChild;
}