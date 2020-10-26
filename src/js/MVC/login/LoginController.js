'use strict';

import Controller from "../../basics/Controller/Controller.js";
import LoginView from "./LoginView.js";
import LoginModel from "./LoginModel.js";

export default class LoginController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new LoginModel()
        this.view = new LoginView(parent, this.model);
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
