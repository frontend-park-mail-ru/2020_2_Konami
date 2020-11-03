'use strict';

import {
    createProfile
} from "../../../components/profile/CreateProfile.js";
import BaseView from "../../basics/BaseView/BaseView.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {
    REDIRECT
} from "../../services/EventBus/EventTypes.js";

export default class ProfileView extends BaseView {

    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;
        this._this = null;
    }

    render(data) {
        this._this = createProfile(data, this.model.getUserId() === data.id);
        this.parent.appendChild(this._this);

        this._addEventListeners();
    }
    /**
     * Удаление модального окна со страницы
     */
    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }

    _addEventListeners() {
        const goButton = this._this.getElementsByClassName('stdBtn')[0];
        goButton.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: '/editprofile'});
        })
    }
}
