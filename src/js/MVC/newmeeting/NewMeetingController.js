'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import NewMeetingModel from "@/js/MVC/newmeeting/NewMeetingModel.js";
import NewMeetingView from "@/js/MVC/newmeeting/NewMeetingView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";

import {
    USER_NOT_AUTHORIZED,
} from "@/js/services/EventBus/EventTypes.js";

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
