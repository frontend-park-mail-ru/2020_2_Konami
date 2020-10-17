'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {createNavigation} from "../../../components/header/Navigation/navigation.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {
    ADD_EXIT_LINK,
    LOGIN_SUCCESS,
    LOGOUT_USER
} from "../../services/EventBus/EventTypes.js";

export default class HeaderView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._initEventHandlers();

    }

    _initEventHandlers() {
        this._eventHandlers = {
            onLoginedUser: () => {
                this._addExitLink();
            },

            onLogoutUser: () => {
                this._deleteExitLink();
                this.model.logout();
            }
        }
    }

    // TODO(template)
    render() {
        const headerWrapper = document.createElement('div');
        headerWrapper.innerHTML = `
        <header class="header">
            <img src="assets/google.png" class="logo">
            <input type="search" placeholder="Люди, мероприятия" class="searchinput">
            <img src="assets/pericon.svg" class="icon">
        </header>
        `;

        const icon = headerWrapper.getElementsByClassName('icon')[0];
        icon.dataset.section = 'profile';

        this.parent.appendChild(headerWrapper.firstElementChild);
        createNavigation(this.parent);
    }

    registerEvents() {
        EventBus.onEvent(LOGIN_SUCCESS, this._eventHandlers.onLoginedUser);
        EventBus.onEvent(ADD_EXIT_LINK, this._eventHandlers.onLoginedUser);
        EventBus.onEvent(LOGOUT_USER, this._eventHandlers.onLogoutUser);
    }

    unRegisterEvents() {
        EventBus.offEvent(LOGIN_SUCCESS, this._eventHandlers.onLoginedUser);
        EventBus.offEvent(ADD_EXIT_LINK, this._eventHandlers.onLoginedUser);
        EventBus.offEvent(LOGOUT_USER, this._eventHandlers.onLogoutUser);
    }

    _addExitLink() {
        const icon = document.getElementsByClassName('icon')[0];
        const span = document.createElement('span');
        const signout = document.createElement('a');
        signout.textContent = 'Выйти';
        signout.dataset.section = 'meetings';

        span.appendChild(signout);
        span.classList.add('popuptext');
        span.id = 'signout';

        const wrapperIcon = document.createElement('div');
        wrapperIcon.classList.add('popup');
        wrapperIcon.append(icon, span);

        document.getElementsByClassName('header')[0].appendChild(wrapperIcon);

        icon.onmouseover = () => {
            let popup = document.getElementById('signout');
            popup.classList.toggle('show');
        }

        signout.addEventListener('click', (evt) => {
            evt.preventDefault();
            EventBus.dispatchEvent(LOGOUT_USER);
        });
    }

    _deleteExitLink() {
        const icon = document.getElementsByClassName('icon')[0];
        const wrapperIcon = document.getElementsByClassName('popup')[0];

        const header =document.getElementsByClassName('header')[0];
        header.removeChild(wrapperIcon);

        header.appendChild(icon);
    }

}
