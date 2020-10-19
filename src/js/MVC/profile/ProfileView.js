'use strict';

import { 
    createProfile 
} from "../../../components/profile/Profile/profileCreateFunc.js";
import BaseView from "../../basics/BaseView/BaseView.js";

export default class ProfileView extends BaseView {

    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;
        this._this = null;

        this._initEventHandlers();
    }

    _initEventHandlers() {
        this._eventHandlers = {
        };
    }

    render(data) {
        this._this = createProfile(data, this.model.getUserId() === data.id);
        console.log(this.parent);
        this.parent.appendChild(this._this);
    }
    /**
     * Удаление модального окна со страницы
     */
    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }

    registerEvents() {
    }

    unRegisterEvents() {
    }
}
