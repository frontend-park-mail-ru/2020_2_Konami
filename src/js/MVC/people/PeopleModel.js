'use strict';

import UserModel from "../../models/UserModel.js";

export default class PeopleModel {
    constructor() {
        this._user = UserModel.user;
    }
}