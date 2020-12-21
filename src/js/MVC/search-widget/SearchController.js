'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import SearchView from "./SearchView.js";
import SearchModel from "./SearchModel.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {
    LOGIN_SUCCESS
} from "@/js/services/EventBus/EventTypes.js";
import Router from "@/js/services/Router/Router";

export default class SearchController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new SearchModel();
        this.view = new SearchView(parent, this.model);

        this.prevController = null;
    }

    activate(prevController) {
        this.prevController = prevController;

        this.view.registerEvents();
        this.view.render();
    }

    deactivate() {
        this.view.erase();
        this.view.unRegisterEvents();

        if (this.prevController) {
            this.prevController.deactivate();
        }
    }

}
