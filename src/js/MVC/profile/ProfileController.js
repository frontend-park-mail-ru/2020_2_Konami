'use strict';

import Controller from "../../basics/Controller/Controller.js";
import ProfileView from "./ProfileView.js";
import ProfileModel from "./ProfileModel.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    getUser
} from "../../services/API/api.js";

import {
    OPEN_LOGIN_MODAL,
    REDIRECT,
} from "../../services/EventBus/EventTypes.js";

export default class ProfileController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new ProfileModel();
        this.view = new ProfileView(parent, this.model);
    }

    activate() {
        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get('userId');
        if (userId === null) {
            userId = this.model.getUserId();
        }
        if (userId === null) {
            EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
            return
        }
        getUser(userId).then(response => {
            let data = response.parsedJson;
            this.view.render(data);
        });
    }

    deactivate() {
        this.view.erase();
    }
}
