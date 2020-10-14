'use strict';

import EventBus from "../../services/EventBus/EventBus.js";
import UserModel from "../../models/UserModel.js";
import {
    SUBMIT_LOGIN,
    REDIRECT,
    INVALID_LOGIN,
    LOGIN_SUCCESS
} from "../../services/EventBus/EventTypes.js";

export default class LoginModel {

    constructor() {
        this._user = UserModel.user;

        EventBus.onEvent(LOGIN_SUCCESS, this.onLoginSuccess);

        EventBus.onEvent(SUBMIT_LOGIN, (data) => {
            const {login, password} = data;
            this._user.login(login, password);
        });
    }

    onLoginSuccess = () => {
        if (!(this._user.isAuthenticated)) {
            EventBus.dispatchEvent(INVALID_LOGIN, {});
        }
        EventBus.dispatchEvent(REDIRECT, {url: '/KEK'});
    }

}
