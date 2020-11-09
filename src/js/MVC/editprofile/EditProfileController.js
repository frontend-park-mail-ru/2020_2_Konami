'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import EditProfileModel from "./EditProfileModel.js";
import EditProfileView from "./EditProfileView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";

import {
    USER_NOT_AUTHORIZED,
} from "@/js/services/EventBus/EventTypes.js";

export default class EditProfileController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new EditProfileModel()
        this.view = new EditProfileView(parent, this.model);
    }

    activate() {
        this.view.registerEvents();
        this.model.checkAuth()
            .then((isAuth) => {
                if (!isAuth) {
                    EventBus.dispatchEvent(USER_NOT_AUTHORIZED);
                    return;
                }
                this.view.render();
            });

    }

    deactivate() {
        this.view.erase();
        this.view.unRegisterEvents();
    }

}
