'use strict';

import UserModel from "../../models/UserModel.js";

export default class HeaderModel {

    constructor() {
        this._user = UserModel.user;
    }

}
