'use strict';

import UserModel from "../../models/UserModel.js";

export default class SignupModel {

    constructor() {
        this._user = UserModel.user;
    }

    signup(name, login, password) {
        this._user.signup(name, login, password);
    }

    async loginAfterSignup(data) {
        const {name, login, password} = data;
        await this._user.login(login, password);
        await this._user.edit({name: name});
    }

}
