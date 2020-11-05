'use strict';

const template = require('./MeetCardTemplate.pug');

export function createMeetCard(data) {
    const monthNames = [
        'января', 
        'февраля', 
        'марта', 
        'апреля', 
        'мая', 
        'июня',
        'июля', 
        'августа', 
        'сентября', 
        'откября', 
        'ноября',
        'декабря',
    ];

    if (data.date !== '') {
        let date = new Date(data.date);
        data.dateStr = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    }

    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}