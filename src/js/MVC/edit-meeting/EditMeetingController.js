'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import NewMeetingModel from "@/js/MVC/newmeeting/NewMeetingModel.js";
import EditMeetingView from "@/js/MVC/edit-meeting/EditMeetingView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";

import {
    USER_NOT_AUTHORIZED,
    PASS_MEET_DATA_TO_EDIT
} from "@/js/services/EventBus/EventTypes.js";

export default class EditMeetingController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new NewMeetingModel()
        this.view = new EditMeetingView(parent, this.model);
    }

    activate() {
        EventBus.onEvent(PASS_MEET_DATA_TO_EDIT, this.view._eventHandlers.onFillingEditingValues);

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
        EventBus.offEvent(PASS_MEET_DATA_TO_EDIT, this.view._eventHandlers.onFillingEditingValues);
    }

}
