'use strict';

import EventBus from "../../services/EventBus/EventBus.js";
import Router from "../../services/Router/Router.js";
import {HIDE_LOGIN_MODAL} from "../../services/EventBus/EventTypes.js";

export const hideModal = () => {
    const modal = document.getElementById('authModal');
    modal.style.display = "none";

    // TODO(заменить на pushState(state = state) чтобы сохранить состояние скролла/формы)
    Router.redirectBack();
}

export const closeModalEventHandler = (evt) => {
    const closeBtn = document.getElementsByClassName("close")[0];
    const modal = document.getElementById('authModal');

    if (evt.target === modal || evt.target === closeBtn) {
        EventBus.dispatchEvent(HIDE_LOGIN_MODAL);
    }
}
