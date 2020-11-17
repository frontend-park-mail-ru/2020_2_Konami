'use strict';

import UserModel from "@/js/models/UserModel.js";

export default class MeetingsModel {
    constructor() {
        this._user = UserModel.user;
        this._data = null;

        this._isQueryEmpty = true;
        this._queryConfig = {
            dateStart: '',
            dateEnd: '',
            filter: '',
            type: '',
        };
    }

    setData(data) {
        this._data = data;
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }
}