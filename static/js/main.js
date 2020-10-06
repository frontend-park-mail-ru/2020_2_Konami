'use strict';

import {
    createLoginFormLayout, 
    createSignupFormLayout
} from "../components/auth/Form/FormLayout.js";

import {
    AjaxModule
} from "../modules/ajax.js";

import {
    createMetPage,
    createPeoplesPage,
    createProfilePage,
} from './pageCreateFunc.js';

import {
    createNavigation,
} from '../components/header/Navigation/navigation.js';

import {
    createHeader,
} from '../components/header/Header/header.js';


const application = document.body;
window.userId = NaN

const Ajax = new AjaxModule();
globalThis.ajax = Ajax.ajax;

globalThis.appConfig = {
    forMe: {
        text: 'Для меня',
        href: '/forme',
    },
    meetings: {
        text: 'Мероприятия',
        href: '/meetings',
        open: () => {
            createMetPage(application);
        },
    },
    people: {
        text: 'Люди',
        href: '/peoples',
        open: () => {
            createPeoplesPage(application);
        },
    },
    profile: {
        text: 'Профиль',
        href: '',
        open: () => {
            profilePage(application);
        },
    },
    registration: {
        text: "Регистрация",
        href: "/registration",
        open: () => {
            signUpPage(application);
        },
    },
    login: {
        text: "Логин",
        href: "/login",
        open: () => {
            loginPage(application);
        },
    }
}

function profilePage(application) {
    ajax('GET', '/me', (status, responseText) => {
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

        loginPage(application);
    });
}

function loginPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);
    const form = createLoginFormLayout(application);
    form.render();
}

window.CurrentTab = 0;
function signUpPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);
    const form = createSignupFormLayout(application);
    form.render();
}

createMetPage(application);

application.addEventListener('click', (evt) => {
    const {target} = evt;

    if (target.dataset.section in appConfig) {
        evt.preventDefault();
        appConfig[target.dataset.section].open();
    }
});
