'use strict';

import {postLogin, getMe, postSignUp, postUser, postPhoto} from "../services/API/api.js";
import EventBus from "../services/EventBus/EventBus.js";
import {
    LOGIN_SUCCESS,
    SIGNUP_SUCCESS,
    EDIT_SUCCESS,
    UPDATE_PHOTO_SUCCESS
} from "../services/EventBus/EventTypes.js";

class UserModel {

    constructor() {
        if (UserModel.__instance) {
            return UserModel.__instance;
        }

        this.userId = null;
        this.isAuthenticated = false;

        UserModel.__instance = this;
    }

    get user() {
        return UserModel.__instance;
    }

    async login(login, password) {
        const {statusCode, error} = await postLogin(login, password);
        switch (statusCode) {
        case 400:
            // TODO(error message)
            // errorMessage.style.display = 'block';
            break;
        case 200:
            this.isAuthenticated = true;
            this.userId = await getMe();
            EventBus.dispatchEvent(LOGIN_SUCCESS);
            break;
        }
    }

    static logout() {

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

    async updatePhoto(photo) {
        const {statusCode, error} = await postPhoto(photo);
        switch (statusCode) {
            case 200:
                EventBus.dispatchEvent(UPDATE_PHOTO_SUCCESS);
                break;
        }
    }

}

export default new UserModel();
