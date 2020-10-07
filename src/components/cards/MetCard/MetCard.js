'use strict';

export function createMetCard(data) {
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
    tmp.innerHTML = window.MetCardTemplate(data);

    return tmp.firstElementChild;
}