'use strict';

import UserModel from "../../models/UserModel.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    INVALID_LOGIN,
    REDIRECT,
    SUBMIT_SIGNUP,
    SIGNUP_SUCCESS,
    EDIT_SUCCESS

} from "../../services/EventBus/EventTypes.js";

export default class SignupModel {

    constructor() {
        this._user = UserModel.user;

        EventBus.onEvent(SIGNUP_SUCCESS, (data) => {
            const {name, login, password} = data;
            (async () => {
                await this._user.login(login, password);
                await this._user.edit({name: name});
            }
            )()
            // TODO(предложить заполнить оставшиеся поля)
            // EventBus.dispatchEvent(REDIRECT, {url: '/KEK'});
        });

        EventBus.onEvent(SUBMIT_SIGNUP, (data) => {
            const {name, login, password} = data;
            this._user.signup(name, login, password);
        });

        EventBus.onEvent(EDIT_SUCCESS, (data) => {
            if (!(this._user.isAuthenticated)) {
                EventBus.dispatchEvent(INVALID_LOGIN, {});
            }
            EventBus.dispatchEvent(REDIRECT, {url: '/LOL'});
        });
    }

}
