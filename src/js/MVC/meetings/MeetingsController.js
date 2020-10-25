'use strict';

import Controller from "../../basics/Controller/Controller.js";
import MeetingsModel from "./MeetingsModel.js";
import { getMeetings } from "../../services/API/api.js";
import MeetingsView from "./MeetingsView.js";

export default class MeetingsController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new MeetingsModel();
        this.view = new MeetingsView(parent, this.model);
    }

    activate() {
        const urlParams = new URLSearchParams(window.location.search);
        let pageNum = urlParams.get('pageNum');
        if (pageNum === null) {
            pageNum = 1;
        }
        getMeetings({pageNum}).then(response => {
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
