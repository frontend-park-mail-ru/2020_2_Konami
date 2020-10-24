'use strict';

import EventBus from "../../services/EventBus/EventBus.js";
import BaseView from "../../basics/BaseView/BaseView.js";
import {createSignupFormLayout} from "../../../components/auth/Form/FormLayout.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import {closeSignupModal} from "../../utils/auth-modal/authModalUtils.js";

import {
    LOGIN_SUCCESS,
    REDIRECT,
    SUBMIT_LOGIN,
    SUBMIT_SIGNUP,
    SIGNUP_SUCCESS,
    EDIT_SUCCESS,
    PASSWORDS_MISMATCH,
    INVALID_PWD_INPUT,
    INVALID_LOGIN_INPUT,
    INVALID_NAME_INPUT,
    USER_ALREADY_EXISTS,
    CLOSE_SIGNUP_MODAL
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
                const errorMessages = this.model.validate(data);
                if (errorMessages.length > 0) {
                    this._showErrorsTexts(errorMessages);
                    return;
                }
                const {name, login, password} = data;
                this.model.signup(name, login, password);

            },

            onSignupSuccess: (data) => {
                this.model.loginAfterSignup(data);
                // TODO(предложить заполнить оставшиеся поля, если нет - редирект)
                // EventBus.dispatchEvent(REDIRECT, {url: '/profile'});
            },

            onSignupPostName: () => {
                EventBus.dispatchEvent(CLOSE_SIGNUP_MODAL);
                EventBus.dispatchEvent(REDIRECT, {url: '/editprofile'});
            },

            onPasswordsMismatch: () => {
                const password = document.getElementsByName('password')[0];
                const repeatPassword = document.getElementsByName('repeatPassword')[0];
                this._showInvalidInputs(password, repeatPassword);
            },


            onInvalidPassword: () => {
                const password = document.getElementsByName('password')[0];
                this._showInvalidInputs(password);
            },

            onInvalidLogin: () => {
                const login = document.getElementsByName('login')[0];
                this._showInvalidInputs(login);
            },

            onInvalidName: () => {
                const name = document.getElementsByName('name')[0];
                this._showInvalidInputs(name);
            },

            onSignupError: () => {
                this._showErrorsTexts(['Пользователь с таким логином уже существует']);
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
        EventBus.onEvent(USER_ALREADY_EXISTS, this._eventHandlers.onSignupError);

        EventBus.onEvent(PASSWORDS_MISMATCH, this._eventHandlers.onPasswordsMismatch);
        EventBus.onEvent(INVALID_PWD_INPUT, this._eventHandlers.onInvalidPassword);
        EventBus.onEvent(INVALID_LOGIN_INPUT, this._eventHandlers.onInvalidLogin);
        EventBus.onEvent(INVALID_NAME_INPUT, this._eventHandlers.onInvalidName);


    }

    unRegisterEvents() {
        EventBus.offEvent(SUBMIT_LOGIN, this._eventHandlers.onSubmitSignupForm);
        EventBus.offEvent(LOGIN_SUCCESS, this._eventHandlers.onSignupSuccess);
        EventBus.offEvent(EDIT_SUCCESS, this._eventHandlers.onSignupPostName);
        EventBus.offEvent(USER_ALREADY_EXISTS, this._eventHandlers.onSignupError);

        EventBus.offEvent(PASSWORDS_MISMATCH, this._eventHandlers.onPasswordsMismatch);
        EventBus.offEvent(INVALID_PWD_INPUT, this._eventHandlers.onInvalidPassword);
        EventBus.offEvent(INVALID_LOGIN_INPUT, this._eventHandlers.onInvalidLogin);
        EventBus.offEvent(INVALID_NAME_INPUT, this._eventHandlers.onInvalidName);

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

            const formFields = {name: name, login: login, password: password, repeatPassword: repeatPassword};
            EventBus.dispatchEvent(SUBMIT_SIGNUP, formFields);
        });

        window.addEventListener('click', closeSignupModal);
    }

    _showErrorsTexts(errors) {
        const errMsg = document.getElementsByClassName('errorMessage')[0];
        errMsg.innerHTML = '';
        errors.forEach((err) => {
            errMsg.innerHTML += err + '<br>';
        })

        errMsg.style.display = 'block';
    }

    _showInvalidInputs() {
        const inputs = [...arguments];
        inputs.forEach((input) => {
            input.classList.add('invalid');
            setTimeout(() => {
                input.classList.toggle('invalid');
            }, 4000);
        })
    }

}
