'use strict';

function wrapCreateChipsFunc(parentNode) {
    return  labelText => {
        const label = document.createElement('span');
        label.classList.add('chips');
        label.innerHTML = labelText;

        parentNode.appendChild(label);
    };
}


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