'use strict';

import Controller from "../../basics/Controller/Controller.js";
import MeetModel from "./MeetModel.js";
import { getMeet } from "../../services/API/api.js";
import MeetView from "./MeetView.js";
import EventBus from "../../services/EventBus/EventBus.js";
import { REDIRECT } from "../../services/EventBus/EventTypes.js";

export default class MeetController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new MeetModel();
        this.view = new MeetView(parent, this.model);
    }

    activate() {
        const urlParams = new URLSearchParams(window.location.search);
        let meetId = urlParams.get('meetId');
        if (meetId === null) {
            EventBus.dispatchEvent(REDIRECT, 'meetings')
        }

        getMeet(meetId).then(response => {
            if (response.statusCode === 200) {
                // kaef
            } else {
                // ne kaef
                return;
            }
            this.view.render(response.parsedJson);
        });
    }

    deactivate() {
        this.view.erase();
    }
}
