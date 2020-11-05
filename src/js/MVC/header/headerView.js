'use strict';

import BaseView from "@/js/basics/BaseView/BaseView.js";
import {createNavigation} from "@/components/header/Navigation/navigation.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {
    LOGIN_SUCCESS,
    LOGOUT_USER,
    OPEN_LOGIN_MODAL,
    REDIRECT
} from "@/js/services/EventBus/EventTypes.js";

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
                this._updateHeader();
            },

            onLogoutUser: () => {
                this._downHeader();
                this.model.logout();
            }
        }
    }

    // TODO(template)
    render() {
        const headerWrapper = document.createElement('div');
        headerWrapper.innerHTML = `
        <header class="header">
            <img src="assets/google.png" data-section="meetings" class="header__logo">
            <input type="search" placeholder="Люди, мероприятия" class="header__search-input">
            <img src="assets/add-meet.svg" id="newMeet" class="header__icon icon square">
            <img src="assets/pericon.svg" id="profileIcon" class="header__icon icon">
        </header>
        `;

        this.parent.appendChild(headerWrapper.firstElementChild);
        createNavigation(this.parent);

        let icon = document.getElementById('profileIcon');
        icon.addEventListener('click', this._onProfileIconClick);

        let logo = document.getElementsByClassName('header__logo')[0];
        logo.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
        });
        // icon.dataset.section = 'profile';

        icon = document.getElementById('newMeet');
        icon.dataset.section = 'newMeeting';
        icon.style.display = 'none';
    }

    registerEvents() {
        EventBus.onEvent(LOGIN_SUCCESS, this._eventHandlers.onLoginedUser);
        EventBus.onEvent(LOGOUT_USER, this._eventHandlers.onLogoutUser);
    }

    unRegisterEvents() {
        EventBus.offEvent(LOGIN_SUCCESS, this._eventHandlers.onLoginedUser);
        EventBus.offEvent(LOGOUT_USER, this._eventHandlers.onLogoutUser);
    }

    _updateHeader() {
        const profileIcon = document.getElementById('profileIcon');
        profileIcon.removeEventListener('click', this._onProfileIconClick);
        profileIcon.dataset.section = 'profile';

        this._addExitLink();
        const newMeetIcon = document.getElementById('newMeet');
        newMeetIcon.style.display = 'block';
    }

    _addExitLink() {
        const icon = document.getElementById('profileIcon');
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

    _downHeader() {
        const profileIcon = document.getElementById('profileIcon');
        profileIcon.addEventListener('click', this._onProfileIconClick);
        profileIcon.removeAttribute('data-section');

        this._deleteExitLink();
        const icon = document.getElementById('newMeet');
        icon.style.display = 'none';
    }

    _deleteExitLink() {
        const icon = document.getElementById('profileIcon');
        const wrapperIcon = document.getElementsByClassName('popup')[0];

        const header =document.getElementsByClassName('header')[0];
        header.removeChild(wrapperIcon);

        header.appendChild(icon);
    }

    _onProfileIconClick() {
        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
    }

}
