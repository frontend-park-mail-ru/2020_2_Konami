'use strict';
import {
    createMetPage,
    createPeoplesPage,
    profilePage,
    loginModal,
    signUpModal
} from './pageCreateFunc.js';

import HeaderController from "./MVC/header/headerController.js";
import Router from "./services/Router/Router.js";
import LoginController from "./MVC/login/LoginController.js";
import MeetingsController from "./MVC/meetings/MeetingsController.js";
import EventBus from "./services/EventBus/EventBus.js";
import SignupController from "./MVC/signup/SignupController.js";
import {
    REDIRECT
} from "./services/EventBus/EventTypes.js";

(() => {
    const application = document.getElementById('app');

    const headerController = new HeaderController(application);
    headerController.activate();

    Router.register('/', new MeetingsController(application));
    Router.register('/login', new LoginController(application));
    Router.register('/signup', new SignupController(application));
    Router.route();

    EventBus.onEvent(REDIRECT, (obj) => {
        const {url} = obj;
        Router.pushState(url);
    })
})()
