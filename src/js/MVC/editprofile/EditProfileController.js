'use strict';

import Controller from "../../basics/Controller/Controller.js";
import EditProfileModel from "./EditProfileModel.js";
import EditProfileView from "./EditProfileView.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    NOT_AUTHORIZED,
} from "../../services/EventBus/EventTypes.js";

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
                    EventBus.dispatchEvent(NOT_AUTHORIZED);
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
