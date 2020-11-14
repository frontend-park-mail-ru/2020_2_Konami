'use strict';

import {postLogin, getMe, postSignUp, postUser, postPhoto, postSignOut} from "../services/API/api.js";
import EventBus from "../services/EventBus/EventBus.js";
import {displayNotification} from "../../components/auth/Notification/Notification.js";
import {
    LOGIN_SUCCESS,
    SIGNUP_SUCCESS,
    EDIT_SUCCESS,
    INVALID_LOGIN,
    USER_ALREADY_EXISTS,
    UPDATE_PHOTO_SUCCESS
} from "../services/EventBus/EventTypes.js";

class UserModel {

    constructor() {
        if (UserModel.__instance) {
            return UserModel.__instance;
        }

        this.userId = null;
        this._isAuthenticated = false;

        this.userCity = null;
        this.userAddress = null;

        UserModel.__instance = this;
    }

    get user() {
        return UserModel.__instance;
    }

    async isAuthenticated() {
        if (this._isAuthenticated) {
            return true;
        }

        const {statusCode, body} = await getMe();
        if (statusCode === 200) {
            this.userId = body.userId;
            this._isAuthenticated = true;
        }

        return this._isAuthenticated;
    }

    async login(login, password) {
        const {statusCode} = await postLogin(login, password);
        switch (statusCode) {
        case 400:
            EventBus.dispatchEvent(INVALID_LOGIN);
            break;
        case 401:
            EventBus.dispatchEvent(INVALID_LOGIN);
            break;
        case 201:
            this._isAuthenticated = true;
            const {statusCode, body} = await getMe();
            if (statusCode === 200) {
                this.userId = body.userId;
                EventBus.dispatchEvent(LOGIN_SUCCESS);
            }
            break;

        case undefined:
            displayNotification('Проверьте соединение с интернетом!');
            break;

        case 228:
            displayNotification('Проверьте соединение с интернетом!');
            break;
        }
    }

    async logout() {
        const {statusCode} = await postSignOut();
        switch (statusCode) {
            case 200:
                this.userId = null;
                this._isAuthenticated = false;
                // EventBus.dispatchEvent(LOGOUT_SUCCESS);
                break;

            case undefined:
                displayNotification('Проверьте соединение с интернетом!');
                break;

            case 228:
                displayNotification('Проверьте соединение с интернетом!');
                break;
        }

    }

    async signup(name, login, password) {
        const {statusCode} = await postSignUp(login, password);
        switch (statusCode) {
            case 409:
                EventBus.dispatchEvent(USER_ALREADY_EXISTS);
                break;
            case 201:
                EventBus.dispatchEvent(SIGNUP_SUCCESS, {name: name, login: login, password: password});
                break;

            case undefined:
                displayNotification('Проверьте соединение с интернетом!');
                break;

            case 228:
                displayNotification('Проверьте соединение с интернетом!');
                break;
        }
    }

    async edit(editFields) {
        const {statusCode} = await postUser(editFields);
        switch (statusCode) {
            case 200:
                EventBus.dispatchEvent(EDIT_SUCCESS, editFields);
                break;

            case undefined:
                displayNotification('Проверьте соединение с интернетом!');
                break;

            case 228:
                displayNotification('Проверьте соединение с интернетом!');
                break;
        }
    }

    async updatePhoto(photoFormData) {
        const {statusCode} = await postPhoto(photoFormData);
        switch (statusCode) {
            case 200:
                // TODO (UPDATE_PHOTO_SUCCESS)
                EventBus.dispatchEvent(UPDATE_PHOTO_SUCCESS);
                break;

            case undefined:
                displayNotification('Проверьте соединение с интернетом!');
                break;

            case 228:
                displayNotification('Проверьте соединение с интернетом!');
                break;
        }
    }

    getUserGeolocation() {
        if (window.navigator.geolocation) {
            let geoString;

            const successfulLookup = position => {
                const {latitude, longitude} = position.coords;
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=53ac38893add4260ad53c663306ec75c`)
                    .then(response => response.json())
                    .then((geo) => {
                        geoString = geo.results[0].formatted;
                        const tokens = geoString.split(', ');
                        this.userCity = tokens[tokens.length - 3];

                        tokens.splice(tokens.length - 3, 3);
                        this.userAddress = tokens.join(', ');

                        console.log(this.userCity, this.userAddress);
                    });
            }
            window.navigator.geolocation
                .getCurrentPosition(successfulLookup, console.log);

        }
    }

}

export default new UserModel();
