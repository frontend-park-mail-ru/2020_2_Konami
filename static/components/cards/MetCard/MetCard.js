'use strict';

import {
    wrapCreateChipsFunc
} from '../CardChips/Chips.js';

export function createMetCard(data) {
    const tmp = document.createElement('div');
    let dateStr = ""
    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "откября", "ноября", "декабря"];
    if (data.date !== "") {
        let date = new Date(data.date);
        dateStr = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    }
    tmp.innerHTML = `
        <div class="metcard" id="${data.id}metcard">
            <img src="${data.imgSrc}" class="metimg">
            <div class="swimblock top">
                <span>${data.text}</span>
                <div class="tags"></div>  
            </div>
            <h3>${data.title}</h3>
            <h4>${data.place}</h4>
            <h4>${dateStr}</h4>
        </div>
    `;

    const tags = tmp.getElementsByClassName('tags')[0];
    data.tags.forEach(wrapCreateChipsFunc(tags));

    return tmp.firstElementChild;
}