'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import {loginModal} from "../../pageCreateFunc.js";
import {createLoginFormLayout} from "../../../components/auth/Form/FormLayout.js";
import Router from "../../services/Router/Router.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {closeLoginModal} from "../../utils/auth/authModalUtils.js";
import {
    CLOSE_LOGIN_MODAL,
    INVALID_LOGIN,
    LOGIN_SUCCESS,
    OPEN_SIGNUP_MODAL,
    REDIRECT,
    SUBMIT_LOGIN,
} from "../../services/EventBus/EventTypes.js";

export default class LoginView extends BaseView {

    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;

        this._initEventHandlers();
    }

    _initEventHandlers() {
        this._eventHandlers = {

            onSubmitLoginForm: (data) => {
                const {login, password} = data;
                this.model.login(login, password);
            },

            onLoginSuccess: () => {
                EventBus.dispatchEvent(CLOSE_LOGIN_MODAL);
                EventBus.dispatchEvent(REDIRECT, {url: location.pathname});
            },

            onInvalidLoginOrPwd: () => {
                const errMsg = document.getElementsByClassName('errorMessage')[0];
                errMsg.style.display = 'block';
            }

        }
    }

    /** Генерируется и отрисовывается   модальное окно с формой авторизации */
    render() {
        //TODO(Заменить на шаблонизаторы)
        const loginForm = createLoginFormLayout(document.getElementsByClassName('header')[0]);
        const modal = createModalDialog({id:'authModal', classList: ['modal']}, [loginForm.form]);

        this.parent.appendChild(modal);

        modal.style.display = "block";

        this._addEventListeners();
    }
    /**
     * Удаление модального окна со страницы
     */
    erase() {
        const modal = document.getElementById('authModal');
        this.parent.removeChild(modal);

        window.removeEventListener('click', closeLoginModal);
    }


    registerEvents() {
        EventBus.onEvent(SUBMIT_LOGIN, this._eventHandlers.onSubmitLoginForm);
        EventBus.onEvent(LOGIN_SUCCESS, this._eventHandlers.onLoginSuccess);
        EventBus.onEvent(INVALID_LOGIN, this._eventHandlers.onInvalidLoginOrPwd);

    }

    unRegisterEvents() {
        EventBus.onEvent(SUBMIT_LOGIN, this._eventHandlers.onSubmitLoginForm);
        EventBus.offEvent(LOGIN_SUCCESS, this._eventHandlers.onLoginSuccess);
        EventBus.offEvent(INVALID_LOGIN, this._eventHandlers.onInvalidLoginOrPwd);

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

        const signupRedirection = document.getElementsByClassName('message')[0];
        signupRedirection.addEventListener('click', (evt) => {
            evt.preventDefault();
            EventBus.dispatchEvent(CLOSE_LOGIN_MODAL);
            EventBus.dispatchEvent(OPEN_SIGNUP_MODAL);
        });

        window.addEventListener('click', closeLoginModal);
    }

}
