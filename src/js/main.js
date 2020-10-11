'use strict';

import {
    AjaxModule
} from "../modules/ajax.js";

import {
    createMetPage,
    createPeoplesPage,
    profilePage,
    loginModal,
    signUpModal
} from './pageCreateFunc.js';


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
            signUpModal(application);
        },
    },
    login: {
        text: "Логин",
        href: "/login",
        open: () => {
            loginModal(application);
        },
    }
}

createMetPage(application);

application.addEventListener('click', (evt) => {
    const {target} = evt;

    if (target.dataset.section in globalThis.appConfig) {
        evt.preventDefault();
        globalThis.appConfig[target.dataset.section].open();
    }
});
