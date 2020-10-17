import {createMetPage, createPeoplesPage} from "../pageCreateFunc.js";

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
        href: '/profile',
    },

    editprofile: {
        text: 'Редактировать профиль',
        href: '/editprofile',
    },
    // registration: {
    //     text: "Регистрация",
    //     href: "/signup",
    //     open: () => {
    //         signUpModal(application);
    //     },
    // },
    // login: {
    //     text: "Логин",
    //     href: "/login",
    //     open: () => {
    //         loginModal(application);
    //     },
    // }
}

export default appConfig;
