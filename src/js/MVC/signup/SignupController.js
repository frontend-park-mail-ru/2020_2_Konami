'use strict';

import Controller from "../../basics/Controller/Controller.js";
import SignupView from "./SignupView.js";
import SignupModel from "./SignupModel.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {
    EDIT_SUCCESS
} from "../../services/EventBus/EventTypes.js";

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

        /** Это нужно чтобы при дальнейшем редактировании профиля (EDIT_SUCCESS) не применялся обработчик */
        EventBus.offEvent(EDIT_SUCCESS, this.model.onEditOnSignupSuccess)
    }

    activate() {
        EventBus.onEvent(EDIT_SUCCESS, this.model.onEditOnSignupSuccess);

        this.view.render();

    }
}
