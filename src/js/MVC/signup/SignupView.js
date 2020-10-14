'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {createLoginFormLayout, createSignupFormLayout} from "../../../components/auth/Form/FormLayout.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {hideModal, closeModalEventHandler} from "../../utils/auth/authModalUtils.js";
import {isValidPassword} from "../../auth/formValidators.js";

import {
    HIDE_LOGIN_MODAL, SUBMIT_SIGNUP
} from "../../services/EventBus/EventTypes.js";

export default class SignupView extends BaseView {

    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;
    }

    /** Генерируется модальное окно с формой авторизации */
    render() {

        //TODO(Заменить на шаблонизаторы)
        const signupForm = createSignupFormLayout(document.getElementsByClassName('header')[0]);
        const modal = createModalDialog({id:'authModal', classList: ['modal']}, [signupForm.form]);

        this.parent.appendChild(modal);

        modal.style.display = "block";

        this._addEventListeners();
    }

    _addEventListeners() {
        EventBus.onEvent(HIDE_LOGIN_MODAL, hideModal);

        const form = document.forms[0];
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();

            let input = document.getElementsByName('login')[0];
            const login = input.value.trim();

            input = document.getElementsByName('password')[0];
            const password = input.value.trim();

            input = document.getElementsByName('repeatPassword')[0];
            const repeatPassword = input.value.trim();

            input = document.getElementsByName('name')[0];
            const name = input.value.trim();

            //TODO(Валидатор сложности пароля)
            if (!isValidPassword(password, repeatPassword)) {
                password.classList.add('invalid');
                repeatPassword.classList.add('invalid');
                return
            }

            EventBus.dispatchEvent(SUBMIT_SIGNUP, {name: name, login: login, password: password});
        });

        window.addEventListener('click', closeModalEventHandler);
    }

}
