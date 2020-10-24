'use strict';

import  BaseView from "../../basics/BaseView/BaseView.js";
import {createNewMeetingForm} from "../../utils/meetings/NewMeetFormCreate.js";

export default class NewMeetingView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        // this._initEventHandlers();
    }

    _initEventHandlers() {

    }

    render() {
        const form = createNewMeetingForm();
        this.parent.appendChild(form);

        this._addEventListeners();
    }

    erase() {
        const form = document.forms[0];
        if (form !== undefined) {
            this.parent.removeChild(form);
        }
    }

}

