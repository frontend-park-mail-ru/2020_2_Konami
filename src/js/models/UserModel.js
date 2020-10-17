'use strict';

import {postLogin, getMe, postSignUp, postUser, postPhoto, postSignOut} from "../services/API/api.js";
import EventBus from "../services/EventBus/EventBus.js";
import {
    LOGIN_SUCCESS,
    SIGNUP_SUCCESS,
    EDIT_SUCCESS,
    UPDATE_PHOTO_SUCCESS,
    INVALID_LOGIN
} from "../services/EventBus/EventTypes.js";

class UserModel {

    constructor() {
        if (UserModel.__instance) {
            return UserModel.__instance;
        }

        this.userId = null;
        this._isAuthenticated = false;

        UserModel.__instance = this;
    }

    get user() {
        return UserModel.__instance;
    }

    async isAuthenticated() {
        if (this._isAuthenticated) {
            return true;
        }

        const {statusCode, body, error} = await getMe();
        if (statusCode === 200) {
            this.userId = body.userId;
            this._isAuthenticated = true;
        }

        return this._isAuthenticated;
    }

    async login(login, password) {
        const {statusCode, error} = await postLogin(login, password);
        switch (statusCode) {
        case 400:
            // TODO(error message)
            // errorMessage.style.display = 'block';
            EventBus.dispatchEvent(INVALID_LOGIN);
            break;
        case 200:
            this._isAuthenticated = true;
            const {statusCode, body, error} = await getMe();
            if (statusCode === 200) {
                this.userId = body.userId;
                EventBus.dispatchEvent(LOGIN_SUCCESS);
            }
            break;
        }
    }

    async logout() {
        const {statusCode, error} = await postSignOut();
        switch (statusCode) {
            case 200:
                // EventBus.dispatchEvent(LOGOUT_SUCCESS);
                break;
        }

    }

    async signup(name, login, password) {
        const {statusCode, error} = await postSignUp(login, password);
        switch (statusCode) {
            case 400:
                // TODO(error message)
                // errorMessage.style.display = 'block';
                break;
            case 200:
                EventBus.dispatchEvent(SIGNUP_SUCCESS, {name: name, login: login, password: password});
                break;
        }
    }

    async edit(editFields) {
        const {statusCode, error} = await postUser(editFields);
        switch (statusCode) {
            case 200:
                EventBus.dispatchEvent(EDIT_SUCCESS, editFields);
                break;
        }
    }

    async updatePhoto(photoFormData) {
        const {statusCode, error} = await postPhoto(photoFormData);
        switch (statusCode) {
            case 200:
                // TODO (UPDATE_PHOTO_SUCCESS)
                // EventBus.dispatchEvent(UPDATE_PHOTO_SUCCESS);
                break;
        }
    }

}

export default new UserModel();
