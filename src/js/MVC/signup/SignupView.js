'use strict';

import EventBus from "@/js/services/EventBus/EventBus.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import {createSignupFormLayout} from "@/components/auth/Form/FormLayout.js";
import {createModalDialog} from "@/components/auth/ModalDialog/ModalDialog.js";
import {closeSignupModal} from "@/js/utils/auth-modal/authModalUtils.js";
import {displayNotification} from "@/components/auth/Notification/Notification.js";
import {closeTagsModalDialog} from "@/components/auth/SelectedTag/SelectedTag.js";
import {createTagsModal} from "@/components/auth/TagsModal/TagsModal.js";
import {getSelectedTags} from "@/components/auth/TagsModal/TagsModal";

import {
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
    CLOSE_SIGNUP_MODAL,
    APPLY_TAGS_MODAL,
    CLOSE_TAGS_MODAL
} from "@/js/services/EventBus/EventTypes.js";

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
                displayNotification('Вы успешно зарегестрировались');
                // TODO(предложить заполнить оставшиеся поля, если нет - редирект)
                // EventBus.dispatchEvent(REDIRECT, {url: '/profile'});
            },

            onSignupPostName: () => {
                // EventBus.dispatchEvent(CLOSE_SIGNUP_MODAL);
                // EventBus.dispatchEvent(REDIRECT, {url: '/editprofile'});
                const authModal = document.getElementById('authModal');
                authModal.style.display = 'none';

                const tagsModalBlock = createTagsModal();
                this.parent.appendChild(tagsModalBlock);
                tagsModalBlock.style.display= 'block';

            },

            onApplyTags: () => {
                const fieldMap = new Map();
                fieldMap.set('meetingTags', getSelectedTags());
                this.model.applyTagsAfterSignup(Object.fromEntries(fieldMap.entries()));
                EventBus.dispatchEvent(CLOSE_SIGNUP_MODAL);
                displayNotification('Вы успешно применили тэги');
            },

            onExitApplyingTags: () => {
                const tagsModal = document.getElementById('modalTags');
                this.parent.removeChild(tagsModal);
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
        const authModal = document.getElementById('authModal');
        const tagsModal = document.getElementById('modalTags');

        this.parent.removeChild(authModal);
        this.parent.removeChild(tagsModal);

        window.removeEventListener('click', closeSignupModal);
        window.removeEventListener('click', closeTagsModalDialog);
    }

    registerEvents() {
        EventBus.onEvent(SUBMIT_SIGNUP, this._eventHandlers.onSubmitSignupForm);
        EventBus.onEvent(SIGNUP_SUCCESS, this._eventHandlers.onSignupSuccess);
        EventBus.onEvent(EDIT_SUCCESS, this._eventHandlers.onSignupPostName);
        EventBus.onEvent(APPLY_TAGS_MODAL, this._eventHandlers.onApplyTags);
        EventBus.onEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onExitApplyingTags);


        EventBus.onEvent(USER_ALREADY_EXISTS, this._eventHandlers.onSignupError);
        EventBus.onEvent(PASSWORDS_MISMATCH, this._eventHandlers.onPasswordsMismatch);
        EventBus.onEvent(INVALID_PWD_INPUT, this._eventHandlers.onInvalidPassword);
        EventBus.onEvent(INVALID_LOGIN_INPUT, this._eventHandlers.onInvalidLogin);
        EventBus.onEvent(INVALID_NAME_INPUT, this._eventHandlers.onInvalidName);
    }

    unRegisterEvents() {
        EventBus.offEvent(SUBMIT_LOGIN, this._eventHandlers.onSubmitSignupForm);
        EventBus.offEvent(SIGNUP_SUCCESS, this._eventHandlers.onSignupSuccess);
        EventBus.offEvent(EDIT_SUCCESS, this._eventHandlers.onSignupPostName);
        EventBus.offEvent(APPLY_TAGS_MODAL, this._eventHandlers.onApplyTags);
        EventBus.offEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onExitApplyingTags);

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
        window.addEventListener('click', closeTagsModalDialog);

        const appltTagsBtn = document.getElementById("closeTagsModal");
        appltTagsBtn.addEventListener('click', (evt) => {
            evt.preventDefault();
            const tagsModalBlock = document.getElementById('modalTags');
            tagsModalBlock.style.display = "none";
            EventBus.dispatchEvent(APPLY_TAGS_MODAL);
        });

    }

    _showErrorsTexts(errors) {
        const errMsg = document.getElementsByClassName('error-message')[0];
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
