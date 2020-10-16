'use strict';

import UserModel from "../../models/UserModel.js";
import EventBus from "../../services/EventBus/EventBus.js";

export default class HeaderModel {

    constructor() {
        this._user = UserModel.user;


    }

}
