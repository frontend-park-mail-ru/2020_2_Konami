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

import {
    createSignupFormLayout
} from "../components/auth/Form/FormLayout.js";

import {createModalDialog, placeAuthModal} from "../components/auth/ModalDialog/ModalDialog.js";


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

function profilePage(application) {
    globalThis.ajax('GET', '/me', (status, responseText) => {
        let isAuthorized = false;

        if (status === 200) {
            isAuthorized = true;
        }

        if (status === 401) {
            isAuthorized = false;
        }

        if (isAuthorized) {
            const respData = JSON.parse(responseText);
            window.userId = respData.userId
            createProfilePage(application, window.userId);
            return;
        }

        loginModal(application);
    });
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

function loginModal(application) {
    let modal = document.getElementById("authModal");
    const closeBtn = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

function signUpModal(application) {
    const header = document.getElementsByClassName('header')[0];
    let modal = document.getElementById("authModal");
    header.removeChild(modal);

    const signupForm = createSignupFormLayout(application);

    modal = createModalDialog({id:'authModal', classList: ['modal']}, [signupForm.form]);
    header.appendChild(modal);

    modal.style.display = "block";
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            placeAuthModal();
        }
    }
}

export {
    createPeoplesPage,
    createMetPage,
    createProfilePage,
    loginModal,
    signUpModal,
    profilePage
}
