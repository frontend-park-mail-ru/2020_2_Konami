'use strict';

import EventBus from "../../services/EventBus/EventBus.js";
import UserModel from "../../models/UserModel.js";
import {
    SUBMIT_LOGIN,
    REDIRECT,
    INVALID_LOGIN
} from "../../services/EventBus/EventTypes.js";

export default class LoginModel {

    constructor() {
        this._user = UserModel.user;

        EventBus.onEvent(SUBMIT_LOGIN, () => {
            if (!(this._user.isAuthenticated)) {
                EventBus.dispatchEvent(INVALID_LOGIN, {});
            }
            EventBus.dispatchEvent(REDIRECT, {url: '/profile'});
        })
    }

}
