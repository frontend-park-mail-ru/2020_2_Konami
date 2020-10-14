'use strict';

import Controller from "../../basics/Controller/Controller.js";
import LoginView from "./LoginView.js";
import LoginModel from "./LoginModel.js";

export default class LoginController extends Controller {

    constructor(parent) {
        super(parent);
        this.view = new LoginView(parent, new LoginModel());
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
