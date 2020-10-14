'use strict';

import Controller from "../../basics/Controller/Controller.js";
import SignupView from "./SignupView.js";
import SignupModel from "./SignupModel.js";
import EventBus from "../../services/EventBus/EventBus.js";

export default class SignupController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new SignupModel()
        this.view = new SignupView(parent, this.model);
    }

    /** При вызове деструктора модальное окно просто удаляется из application*/
    destructor() {
        const modal = document.getElementById('authModal');
        this.parent.removeChild(modal);
    }

    activate() {
        this.view.render();

    }
}
