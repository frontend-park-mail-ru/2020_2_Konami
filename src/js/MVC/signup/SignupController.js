'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import SignupView from "./SignupView.js";
import SignupModel from "./SignupModel.js";

export default class SignupController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new SignupModel()
        this.view = new SignupView(parent, this.model);
    }

    activate() {
        this.view.registerEvents();
        this.view.render();
    }

    /**
     * При вызове деструктора модальное окно просто удаляется из application
     * Отписка всех обработчиков событий
     */
    deactivate() {
        this.view.erase();
        this.view.unRegisterEvents();
    }
}
