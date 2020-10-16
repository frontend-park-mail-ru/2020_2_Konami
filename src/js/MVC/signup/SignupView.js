'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {createLoginFormLayout, createSignupFormLayout} from "../../../components/auth/Form/FormLayout.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {closeSignupModal} from "../../utils/auth/authModalUtils.js";
import {isValidPassword} from "../../auth/formValidators.js";

import {
    INVALID_LOGIN, LOGIN_SUCCESS, REDIRECT, SUBMIT_LOGIN,
    SUBMIT_SIGNUP,
    SIGNUP_SUCCESS, EDIT_SUCCESS
} from "../../services/EventBus/EventTypes.js";

export default class SignupView extends BaseView {

    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;

        this._initEventHandlers();
    }

    _initEventHandlers() {
        this._eventHandlers = {

            onSubmitSignupForm: (data) => {
                const {name, login, password} = data;
                this.model.signup(name, login, password);
            },

            onSignupSuccess: (data) => {
                this.model.loginAfterSignup(data);
                // TODO(предложить заполнить оставшиеся поля, если нет - редирект)
                // EventBus.dispatchEvent(REDIRECT, {url: '/profile'});
            },

            onSignupPostName: () => {
                EventBus.dispatchEvent(REDIRECT, {url: '/editprofile'});
            }

        }
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

    erase() {
        const modal = document.getElementById('authModal');
        this.parent.removeChild(modal);

        window.removeEventListener('click', closeSignupModal);
    }

    registerEvents() {
        EventBus.onEvent(SUBMIT_SIGNUP, this._eventHandlers.onSubmitSignupForm);
        EventBus.onEvent(SIGNUP_SUCCESS, this._eventHandlers.onSignupSuccess);
        EventBus.onEvent(EDIT_SUCCESS, this._eventHandlers.onSignupPostName);

    }

    unRegisterEvents() {
        EventBus.offEvent(SUBMIT_LOGIN, this._eventHandlers.onSubmitSignupForm);
        EventBus.offEvent(LOGIN_SUCCESS, this._eventHandlers.onSignupSuccess);
        EventBus.offEvent(EDIT_SUCCESS, this._eventHandlers.onSignupPostName);
    }

    _addEventListeners() {
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

        window.addEventListener('click', closeSignupModal);
    }

}
