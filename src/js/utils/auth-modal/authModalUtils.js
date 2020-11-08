'use strict';

import EventBus from "../../services/EventBus/EventBus.js";
import LoginController from "../../MVC/login/LoginController.js";
import SignupController from "../../MVC/signup/SignupController.js";
import {
    OPEN_LOGIN_MODAL,
    CLOSE_LOGIN_MODAL,
    OPEN_SIGNUP_MODAL,
    CLOSE_SIGNUP_MODAL,
} from "../../services/EventBus/EventTypes.js";

const registerAuthModalWindows = (application) => {
    const loginController = new LoginController(application);
    const signupController = new SignupController(application);

    EventBus.onEvent(OPEN_LOGIN_MODAL, () => {
        loginController.activate();
    });

    EventBus.onEvent(CLOSE_LOGIN_MODAL, () => {
        loginController.deactivate();
    });

    EventBus.onEvent(OPEN_SIGNUP_MODAL, () => {
        signupController.activate();
    });

    EventBus.onEvent(CLOSE_SIGNUP_MODAL, () => {
        signupController.deactivate();
    });
}

const closeLoginModal = (evt) => {
    closeModal(evt, CLOSE_LOGIN_MODAL);
}
const closeSignupModal = (evt) => {
    closeModal(evt, CLOSE_SIGNUP_MODAL);
}

const closeModal = (evt, type) => {
    const closeBtn = document.getElementsByClassName("modal__close")[0];
    const modal = document.getElementById('authModal');

    if (evt.target === modal || evt.target === closeBtn) {
        modal.style.display = "none";
        EventBus.dispatchEvent(type);
    }
}


export {
    registerAuthModalWindows,
    closeLoginModal,
    closeSignupModal
}
