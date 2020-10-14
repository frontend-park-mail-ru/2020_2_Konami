'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import {loginModal} from "../../pageCreateFunc.js";
import {createLoginFormLayout} from "../../../components/auth/Form/FormLayout.js";
import Router from "../../services/Router/Router.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {
    HIDE_LOGIN_MODAL,
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

        EventBus.onEvent(HIDE_LOGIN_MODAL, hideLoginModal);

        const closeBtn = document.getElementsByClassName("close")[0];

        window.addEventListener('click', (evt) => {
            if (evt.target === modal || evt.target === closeBtn) {
                EventBus.dispatchEvent(HIDE_LOGIN_MODAL);
            }
        });

    }

}

const hideLoginModal = () => {
    EventBus.offEvent(HIDE_LOGIN_MODAL, hideLoginModal);

    const modal = document.getElementById('authModal');
    modal.style.display = "none";

    // TODO(заменить на pushState(state = state) чтобы сохранить состояние скролла/формы)
    Router.redirectBack();
}
