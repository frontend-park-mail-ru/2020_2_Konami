'use strict';

import {
    wrapCreateChipsFunc
} from '../CardChips/Chips.js';

export function createUserCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="usercard" id="${data.id}usercard">
            <img src="${data.imgSrc}" class="overlay">
            <div class="overlay"></div>
            <div class="wraper top">
                <h2>${data.name}</h2>
                <span>${data.job.replace("\n", "<br/>")}</span>
                
                <h3>Интересы</h3>
                <div class="tags"></div>
                
                <h3>Навыки</h3>
                <div class="tags"></div>
            </div>
        </div>
    `;

    const interests = tmp.getElementsByClassName('tags')[0];
    data.interestTags.forEach(wrapCreateChipsFunc(interests));

    const skills = tmp.getElementsByClassName('tags')[1];
    data.skillTags.forEach(wrapCreateChipsFunc(skills));
    
    return tmp.firstElementChild;
}