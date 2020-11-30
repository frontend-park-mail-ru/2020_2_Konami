'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import ProfileView from "./ProfileView.js";
import ProfileModel from "./ProfileModel.js";
import EventBus from "@/js/services/EventBus/EventBus.js";

import {
    getUser
} from "@/js/services/API/api.js";

import {
    OPEN_LOGIN_MODAL,
} from "@/js/services/EventBus/EventTypes.js";

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
            console.log(response);
            this.view.render(data);
        });

        this.view.registerEvents();
    }

    deactivate() {
        this.view.erase();
        this.view.unRegisterEvents();
    }
}
