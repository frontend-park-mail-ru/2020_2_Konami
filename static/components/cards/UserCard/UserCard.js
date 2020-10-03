'use strict';

function createUserCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="usercard" id="${data.cardId}usercard">
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

    const interestings = tmp.getElementsByClassName('tabels')[0];
    data.interestings.forEach(wrapCreateChipsFunc(interestings));

    const skills = tmp.getElementsByClassName('tabels')[1];
    data.skills.forEach(wrapCreateChipsFunc(skills));
    
    return tmp.firstElementChild;
}