'use strict';

import {
    wrapCreateChipsFunc
} from '../CardChips/Chips.js';

export function createUserCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="usercard" id="${data.userId}usercard">
            <img src="${data.imgSrc}" class="overlay">
            <div class="overlay"></div>
            <div class="wraper top">
                <h2>${data.name}</h2>
                <span>${data.job}</span>
                
                <h3>Интересы</h3>
                <div class="tabels"></div>
                
                <h3>Навыки</h3>
                <div class="tabels"></div>
            </div>
        </div>
    `;

    const interests = tmp.getElementsByClassName('tabels')[0];
    data.interestsArray.forEach(wrapCreateChipsFunc(interests));

    const skills = tmp.getElementsByClassName('tabels')[1];
    data.skillsArray.forEach(wrapCreateChipsFunc(skills));
    
    return tmp.firstElementChild;
}