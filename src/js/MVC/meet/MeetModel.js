'use strict';

import UserModel from "@/js/models/UserModel.js";

export default class MeetModel {
    constructor() {
        this._user = UserModel.user;
    }

    getUserId() {
        return this._user.userId;
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }
}