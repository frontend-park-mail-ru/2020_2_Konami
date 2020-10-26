'use strict';

import Controller from "../../basics/Controller/Controller.js";
import NewMeetingModel from "./NewMeetingModel.js";
import NewMeetingView from "./NewMeetingView.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    USER_NOT_AUTHORIZED,
} from "../../services/EventBus/EventTypes.js";

export default class NewMeetingController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new NewMeetingModel()
        this.view = new NewMeetingView(parent, this.model);
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
