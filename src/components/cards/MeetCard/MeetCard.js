'use strict';

const template = require('./MeetCardTemplate.pug');

export function createMeetCard(data) {
    let startDate = new Date(data.startDate);
    let endDate = new Date(data.endDate);
    let currentDate = Date.now();

    // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const options = {weekday: 'long', month: 'long', day: 'numeric' };
    data.dateStr = startDate.toLocaleDateString('ru-RU', options);

    if (startDate > currentDate && data.seatsLeft > 0) {
        data.status = {
            class: 'meetcard__status status status_green',
            text: 'Регистрация идет',
        };
    } else if (startDate < currentDate) {
        data.status = {
            class: 'meetcard__status status status_red',
            text: 'Мероприятие закончилось',
        };
    } else if (startDate < currentDate && endDate > currentDate) {
        data.status = {
            class: 'meetcard__status status status_yellow',
            text: 'Мероприятие идет',
        };
    } else if (data.seatsLeft < 10) {
        data.status = {
            class: 'meetcard__status status status_yellow',
            text: 'Осталось мало мест',
        };
    }

    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}