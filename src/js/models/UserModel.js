'use strict';

import {postLogin, getMe} from "../services/API/api.js";

class UserModel {

    constructor() {
        if (UserModel.__instance) {
            return UserModel.__instance;
        }

        this.userId = null;
        this.isAuthenticated = false;

        UserModel.__instance = this;
    }

    static get user() {
        return this.__instance;
    }

    static async login(login, password) {
        const {status, error} = await postLogin(login, password);
        if (status === 400) {
            // TODO(error message)
            // errorMessage.style.display = 'block';
        }

        if (status === 200) {
            this.isAuthenticated = true;
            this.userId = await getMe();
        }
    }

    static logout() {

    }

}

export default new UserModel();
