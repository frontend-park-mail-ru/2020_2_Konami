'use strict';

import BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {
    LOGIN_SUCCESS,
    LOGOUT_USER,
    OPEN_LOGIN_MODAL
} from "@/js/services/EventBus/EventTypes.js";
import { createHeader } from "../../../components/header/Header/header";
import { createHeaderMobile } from "../../../components/header/Header/HeaderMobile";

export default class HeaderView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._this = null;

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
        this._this = createHeaderMobile()
        this.parent.appendChild(this._this);

        let icon = document.getElementById('profileIcon');
        icon.addEventListener('click', this._onProfileIconClick);

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

        document.getElementsByClassName('header-mobile__logo-wrapper')[0].appendChild(wrapperIcon);

        icon.onclick = () => {
            let popup = document.getElementById('profileLinks');
            if (popup) {
                popup.classList.toggle('show');
            }
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

        const header =document.getElementsByClassName('header-mobile__logo-wrapper')[0];
        header.removeChild(wrapperIcon);

        header.appendChild(icon);
    }

    _onProfileIconClick() {
        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
    }

}
