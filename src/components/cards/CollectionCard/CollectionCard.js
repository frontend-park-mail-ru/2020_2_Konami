'use strict';

const template = require('./CollectionCardTemplate.pug');

export function createCollectionCard(data, isMobile) {
    // let startDate = new Date(data.card.startDate);

    // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // const options = {weekday: 'long', month: 'long', day: 'numeric' };
    // data.dateStr = startDate.toLocaleDateString('ru-RU', options);
    //
    // data.seatsInfo = data.card.seatsLeft
    // if (data.card.seatsLeft > 99) {
    //     data.seatsInfo = 'много'
    // }
    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);
    if (isMobile) {
        tmp.firstElementChild.classList.add('collection-card__margin-right');
    }

    return tmp.firstElementChild;
}
