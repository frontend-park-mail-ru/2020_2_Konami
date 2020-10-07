'use strict';

import {
    createProfile,
    addQuitLink,
} from './profileCreateFunc.js';

import {
    getPeople,
    getMeetings,
    getUser,
} from '../api/api.js';

import {
    createNavigation,
} from '../components/header/Navigation/navigation.js';

import {
    createHeader,
} from '../components/header/Header/header.js';

import {
    createMetCard,
} from '../components/cards/MetCard/MetCard.js';

import {
    createUserCard,
} from '../components/cards/UserCard/UserCard.js';


function createMetPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);

    const main = document.createElement('main');
    main.classList.add('main');

    getMeetings(1).then(response => {
        if (response.statusCode === 200) {
            // kaef
        } else {
            // ne kaef
        }
        response.parsedJson.forEach(item => {
            main.appendChild(createMetCard(item));
        });
    });

    application.appendChild(main);
}


function createPeoplesPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);

    const main = document.createElement('main');
    main.classList.add('main');

    getPeople(1).then(response => {
        if (response.statusCode === 200) {
            // kaef
        } else {
            // ne kaef
            return;
        }
        const cards = response.parsedJson;
        cards.forEach(item => {
            const userCard = createUserCard(item);
            userCard.addEventListener('click', () => {
                createProfilePage(application, parseInt(userCard.id));
            });

            main.appendChild(userCard);
        });
    });  

    application.appendChild(main);
}


function createProfilePage(application, userId) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);
    if (!isNaN(window.userId)) {
        addQuitLink();
    }
    getUser(userId).then(response => {
        let data = response.parsedJson;
        application.appendChild(createProfile(data));
        if (window.userId !== userId) {
            Array.from(document.getElementsByClassName('editicon')).forEach(element => {
                element.remove();
            });
            Array.from(document.getElementsByClassName('layout')).forEach(element => {
                element.remove();
            });
        }
    });
}

export {
    createPeoplesPage,
    createMetPage,
    createProfilePage,
}
