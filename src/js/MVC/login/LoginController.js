'use strict';

import Controller from "../../basics/Controller/Controller.js";
import LoginView from "./LoginView.js";
import LoginModel from "./LoginModel.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    LOGIN_SUCCESS
} from "../../services/EventBus/EventTypes.js";

export default class LoginController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new LoginModel()
        this.view = new LoginView(parent, this.model);
    }

    /** При вызове деструктора модальное окно просто удаляется из application*/
    destructor() {
        const modal = document.getElementById('authModal');
        this.parent.removeChild(modal);

        /** Это нужно чтобы при дальнейшем логине (LOGIN_SUCCESS) не применялся обработчик */
        EventBus.offEvent(LOGIN_SUCCESS, this.model.onLoginSuccess)
    }

    activate() {
        EventBus.onEvent(LOGIN_SUCCESS, this.model.onLoginSuccess);

        this.view.render();

    }
}
