import {createMetPage, createPeoplesPage, loginModal, profilePage, signUpModal} from "../pageCreateFunc.js";

const appConfig = {
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
        href: '/login',
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
    // login: {
    //     text: "Логин",
    //     href: "/login",
    //     open: () => {
    //         loginModal(application);
    //     },
    // }
}

export default appConfig;
