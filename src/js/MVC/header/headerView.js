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
        // profileIcon.dataset.section = 'profile';

        this._addProfileLinks();
        const newMeetIcon = document.getElementById('newMeet');
        newMeetIcon.style.display = 'block';
    }

    _addProfileLinks() {
        const icon = document.getElementById('profileIcon');
        const linksContainer = document.createElement('div');

        const profileLink = document.createElement('a');
        profileLink.textContent = 'Профиль';
        profileLink.dataset.section = 'profile';

        const signoutLink = document.createElement('a');
        signoutLink.textContent = 'Выйти';
        signoutLink.dataset.section = 'meetings';

        linksContainer.appendChild(profileLink);
        linksContainer.appendChild(signoutLink);
        linksContainer.classList.add('popup-links__container');
        linksContainer.id = 'profileLinks';

        const wrapperIcon = document.createElement('div');
        wrapperIcon.classList.add('popup-links');
        wrapperIcon.append(icon, linksContainer);

        document.getElementsByClassName('header')[0].appendChild(wrapperIcon);

        icon.onclick = () => {
            let popup = document.getElementById('profileLinks');
            popup.classList.toggle('show');
        }

        signoutLink.addEventListener('click', (evt) => {
            evt.preventDefault();
            EventBus.dispatchEvent(LOGOUT_USER);
        });
    }

    _downHeader() {
        const profileIcon = document.getElementById('profileIcon');
        profileIcon.addEventListener('click', this._onProfileIconClick);
        profileIcon.removeAttribute('data-section');

        this._deleteProfileLinks();
        const icon = document.getElementById('newMeet');
        icon.style.display = 'none';
    }

    _deleteProfileLinks() {
        const icon = document.getElementById('profileIcon');
        const wrapperIcon = document.getElementsByClassName('popup-links')[0];

        const header =document.getElementsByClassName('header')[0];
        header.removeChild(wrapperIcon);

        header.appendChild(icon);
    }

    _onProfileIconClick() {
        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
    }

}
