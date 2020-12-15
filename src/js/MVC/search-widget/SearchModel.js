'use strict';

import UserModel from "@/js/models/UserModel.js";

export default class SearchModel {

    constructor() {
        this._user = UserModel.user;
    }

    logout() {
        this._user.logout();
    }

    isMobile() {
        return this._user.isMobile();
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }

}
