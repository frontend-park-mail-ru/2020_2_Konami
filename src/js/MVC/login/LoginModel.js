'use strict';

import UserModel from "../../models/UserModel.js";

export default class LoginModel {

    constructor() {
        this._user = UserModel.user;

    }

    login(login, password) {
        this._user.login(login, password);
    }

    get isAuthenticated() {
        return this._user.isAuthenticated;
    }

}
