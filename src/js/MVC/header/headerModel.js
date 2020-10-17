'use strict';

import UserModel from "../../models/UserModel.js";

export default class HeaderModel {

    constructor() {
        this._user = UserModel.user;
    }

    logout() {
        this._user.logout();
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }

}
