'use strict';

import Controller from "../../basics/Controller/Controller.js";
import HeaderView from "./headerView.js";
import HeaderModel from "./headerModel.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {
    ADD_EXIT_LINK
} from "../../services/EventBus/EventTypes.js";

export default class HeaderController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new HeaderModel();
        this.view = new HeaderView(parent, this.model);
    }

    activate() {
        this.view.registerEvents();
        this.view.render();
        this.model.checkAuth()
            .then((isAuth) => {
                if (isAuth) {
                    EventBus.dispatchEvent(ADD_EXIT_LINK);
                }
            });
    }

    deactivate() {
        this.view.unRegisterEvents();
    }

}
