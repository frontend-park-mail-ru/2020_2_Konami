'use strict';

import UserModel from "@/js/models/UserModel.js";
import Validator from "@/js/services/Validator/Validator.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {
    PASSWORDS_MISMATCH,
    INVALID_PWD_INPUT,
    INVALID_LOGIN_INPUT,
    INVALID_NAME_INPUT


} from "@/js/services/EventBus/EventTypes.js";

export default class SignupModel {

    constructor() {
        this._user = UserModel.user;
        this._validator = new Validator();
    }

    signup(name, login, password) {
        this._user.signup(name, login, password);
    }

    async loginAfterSignup(data) {
        const {name, login, password} = data;
        await this._user.login(login, password);
        await this._user.edit({name: name});
    }

    validate(fields) {
        const errors = [];
        const {name, login, password, repeatPassword} = fields;
        if (password !== repeatPassword) {
            EventBus.dispatchEvent(PASSWORDS_MISMATCH);
            errors.push('Пароли не совпадают');
            return errors;
        }

        // TODO (расскомменить потом)
        let tmpErrors = [];
        tmpErrors = this._validator.validatePassword(password);
        if (tmpErrors.length > 0) {
            EventBus.dispatchEvent(INVALID_PWD_INPUT);
            errors.push(...tmpErrors);
        }

        tmpErrors = this._validator.validateLogin(login);
        if (tmpErrors.length > 0) {
            EventBus.dispatchEvent(INVALID_LOGIN_INPUT);
            errors.push(...tmpErrors);
        }

        tmpErrors = this._validator.validateName(name);
        if (tmpErrors.length > 0) {
            EventBus.dispatchEvent(INVALID_NAME_INPUT);
            errors.push(...tmpErrors);
        }

        return errors;
    }

}
