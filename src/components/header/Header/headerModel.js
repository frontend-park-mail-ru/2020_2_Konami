'use strict';

import UserModel from "../../../js/models/UserModel.js";
import EventBus from "../../../js/services/EventBus/EventBus.js";

export default class HeaderModel {

    constructor() {
        this._user = UserModel.user;
    }

}
