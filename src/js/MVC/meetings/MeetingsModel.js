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
            collectionId: '',
            meetId: '',
            type: '',
        };
    }

    setData(data) {
        this._data = data;
    }

    isMobile() {
        return this._user.isMobile();
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }
}