'use strict';

import UserModel from "@/js/models/UserModel.js";

export default class ProfileModel {
    constructor() {
        this._user = UserModel.user;
    }

    getUserId() {
        return this._user.userId;
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }

    isMobile() {
        return this._user.isMobile();
    }

    async applyTags(fields) {
        await this._user.edit(fields);
    }
}
