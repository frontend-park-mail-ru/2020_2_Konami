'use strict';

import UserModel from "../../models/UserModel.js";

export default class MeetModel {
    constructor() {
        this._user = UserModel.user;
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }
}