'use strict';

function createMetCard(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <div class="metcard" id="${data.cardId}metcard">
            <img src="${data.imgSrc}" class="metimg">
            <div class="swimblock top">
                <span>${data.text}</span>
                <div class="tabels"></div>  
            </div>
            <h3>${data.title}</h3>
            <h4>${data.place}</h4>
            <h4>${data.date}</h4>
        </div>
    `;

    const labels = tmp.getElementsByClassName('tabels')[0];
    data.labels.forEach(wrapCreateChipsFunc(labels));

    return tmp.firstElementChild;
}