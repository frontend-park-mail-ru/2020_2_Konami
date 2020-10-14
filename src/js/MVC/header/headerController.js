'use strict';

import Controller from "../../basics/Controller/Controller.js";
import HeaderView from "./headerView.js";
import HeaderModel from "./headerModel.js";
import EventBus from "../../services/EventBus/EventBus.js";

import {
    REDIRECT,
    SHOW_LOGIN_MODAL
} from "../../services/EventBus/EventTypes.js";

export default class HeaderController extends Controller {

    constructor(parent) {
        super(parent);
        this.view = new HeaderView(parent, new HeaderModel());
    }

    destructor() {

    }

    activate() {
        this.view.render();
        EventBus.onEvent(SHOW_LOGIN_MODAL, () => {

        })

    }

}
