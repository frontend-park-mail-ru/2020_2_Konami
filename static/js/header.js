'use strict';

function createHeader(application) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
        <header class="header">
            <img src="assets/google.png" class="logo">
            <input type="search" placeholder="Люди, мероприятия" class="searchinput">
            <img src="assets/pericon.svg" class="icon">
        </header>
    `;

    const icon = tmp.getElementsByClassName('icon')[0];
    icon.dataset.section = 'profile';

    application.appendChild(tmp.firstElementChild);
}


function createNavigation(application) {
    const navigation = document.createElement('nav');
    navigation.classList.add('navigation');

    const navSettings = [
        'forMe',
        'meetings',
        'people',
    ];

    navSettings.forEach(key => {
        let option = appConfig[key];

        const navPoint = document.createElement('a');
        navPoint.innerHTML = option.text;
        navPoint.href = option.href;
        navPoint.dataset.section = key;
        navPoint.classList.add('navpoint');

        navigation.appendChild(navPoint);
    });
    
    application.appendChild(navigation);
}