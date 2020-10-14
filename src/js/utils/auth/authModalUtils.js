'use strict';

import Router from "../../services/Router/Router.js";

export const closeModalEventHandler = (evt) => {
    const closeBtn = document.getElementsByClassName("close")[0];
    const modal = document.getElementById('authModal');

    if (evt.target === modal || evt.target === closeBtn) {
        modal.style.display = "none";
        // EventBus.dispatchEvent(HIDE_LOGIN_MODAL);
        Router.redirectBack();
    }
}
