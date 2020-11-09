'use strict';

const template = require('./MeetTemplate.pug');

export function createMeetPage(data) {
    let startDate = new Date(data.startDate);
    let endDate = new Date(data.endDate);
    let currentDate = Date.now();

    // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const options = {weekday: 'long', month: 'long', day: 'numeric' };
    data.dateStr = startDate.toLocaleDateString('ru-RU', options);

    if (startDate > currentDate && data.seatsLeft > 0) {
        data.status = {
            class: 'meet__status status status_green',
            text: 'Регистрация идет',
        };
    } else if (startDate < currentDate) {
        data.status = {
            class: 'meet__status status status_red',
            text: 'Мероприятие закончилось',
        };
    } else if (data.seatsLeft <= 0) {
        data.status = {
            class: 'meet__status status status_red',
            text: 'Места закончились',
        };
    } else if (startDate < currentDate && endDate > currentDate) {
        data.status = {
            class: 'meet__status status status_yellow',
            text: 'Мероприятие идет',
        };
    } else if (data.seatsLeft < 10) {
        data.status = {
            class: 'meet__status status status_yellow',
            text: 'Осталось мало мест',
        };
    }

    if (data.currentUserId === data.ownerId) {
        data.buttonStatus = {
            class: 'meet__button meet__button_edit',
            text: 'Редактировать',
        };
    } else if (data.isRegistered) {
        data.buttonStatus = {
            class: 'meet__button meet__button_go',
            text: 'Отменить поход',
        };
    } else if (data.seatsLeft > 0 && endDate > currentDate) {
        data.buttonStatus = {
            class: 'meet__button meet__button_go',
            text: 'Пойти',
        };
    }

    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);

    return tmp.firstElementChild;
}