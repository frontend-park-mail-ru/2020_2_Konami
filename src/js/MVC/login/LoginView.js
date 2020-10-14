'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import {loginModal} from "../../pageCreateFunc.js";
import {createLoginFormLayout} from "../../../components/auth/Form/FormLayout.js";
import Router from "../../services/Router/Router.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {closeModalEventHandler} from "../../utils/auth/authModalUtils.js";
import {
    SUBMIT_LOGIN,
} from "../../services/EventBus/EventTypes.js";

export default class LoginView extends BaseView {

    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;
    }

    /** Генерируется модальное окно с формой авторизации */
    render() {

        //TODO(Заменить на шаблонизаторы)
        const loginForm = createLoginFormLayout(document.getElementsByClassName('header')[0]);
        const modal = createModalDialog({id:'authModal', classList: ['modal']}, [loginForm.form]);

        this.parent.appendChild(modal);

        modal.style.display = "block";

        this._addEventListeners();
    }

    _addEventListeners() {
        const form = document.forms[0];
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();

            let input = document.getElementsByName('login')[0];
            const login = input.value.trim();

            input = document.getElementsByName('password')[0];
            const password = input.value.trim();

            EventBus.dispatchEvent(SUBMIT_LOGIN, {login: login, password: password});
        });

        window.addEventListener('click', closeModalEventHandler);
    }

}
