'use strict';

import Controller from "../../basics/Controller/Controller.js";
import EditProfileModel from "./EditProfileModel.js";
import EditProfileView from "./EditProfileView.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    EDIT_SUCCESS,
    NOT_AUTHORIZED,
    REDIRECT
} from "../../services/EventBus/EventTypes.js";

export default class EditProfileController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new EditProfileModel()
        this.view = new EditProfileView(parent, this.model);
    }

    destructor() {

        EventBus.offEvent(EDIT_SUCCESS, this.model.onEditSuccess);
        this.view.unRegisterEvents();

    }

    activate() {
        this.view.registerEvents();
        if (!(this.model.isAuthenticated)) {
            EventBus.dispatchEvent(NOT_AUTHORIZED);
        }
        this.view.render();

        // EventBus.onEvent(EDIT_SUCCESS, this.model.onEditSuccess);

        // EventBus.onEvent(NOT_AUTHORIZED, () => {
        //     EventBus.dispatchEvent(REDIRECT, {url: '/login'});
        // });

    }

}
