'use strict';

import BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {
    REDIRECT,
    CLOSE_SEARCH_TAB
} from "@/js/services/EventBus/EventTypes.js";
import Router from "@/js/services/Router/Router";

export default class SearchView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._this = null;

        this._initEventHandlers();
    }

    _initEventHandlers() {
        this._eventHandlers = {
            onCloseSearchTab: () => {
                Router.redirectBack();
                // Router.redirectForward();
                setInterval(() => {  // костыль, чтобы когда по кнопке назад вернулись на поиск и отменили его
                    window.history.go(2);  // открылась страница  с которой ушли
                }, 500);
            },
        }
    }

    render() {
        const searchInput = document.getElementsByClassName('search-block__search-input')[0];
        if (searchInput.value === '.') {
            searchInput.value = ''
        }

        const modalSearch = document.getElementsByClassName('search-block')[0];
        modalSearch.style.display = 'flex';

        const cancel = document.getElementsByClassName('search-block__cancel-button')[0];
        cancel.addEventListener('click', this._closeSearchTab);
        window.addEventListener('click', this._hideSearchTab);
    }

    erase() {
        const modalSearch = document.getElementsByClassName('search-block')[0];
        modalSearch.style.display = 'none';

        const cancel = document.getElementsByClassName('search-block__cancel-button')[0];
        cancel.removeEventListener('click', this._closeSearchTab);
        window.removeEventListener('click', this._hideSearchTab);
    }

    registerEvents() {
        EventBus.onEvent(CLOSE_SEARCH_TAB, this._eventHandlers.onCloseSearchTab);
        // EventBus.onEvent(LOGOUT_USER, this._eventHandlers.onLogoutUser)
        // EventBus.onEvent(REDIRECT, this._eventHandlers.onRedirect);

    }

    unRegisterEvents() {
        EventBus.offEvent(CLOSE_SEARCH_TAB, this._eventHandlers.onCloseSearchTab);
        // EventBus.offEvent(LOGOUT_USER, this._eventHandlers.onLogoutUser);
        // EventBus.offEvent(REDIRECT, this._eventHandlers.onRedirect);

    }

    _closeSearchTab() {
        const search = document.getElementsByClassName('search-block__search-input')[0];
        search.value = '';

        const modalSearch = document.getElementsByClassName('search-block')[0];
        modalSearch.style.display = 'none';
        EventBus.dispatchEvent(CLOSE_SEARCH_TAB);
    }

    _hideSearchTab(evt) {
        const searchBlock = document.getElementsByClassName('search-block')[0];
        const searchBtn = document.getElementsByClassName('header-mobile__search')[0];

        if (evt.target !== searchBtn && !(searchBlock.contains(evt.target))) {
            searchBlock.style.display = "none";
        }
    }

}
