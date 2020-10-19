'use strict';

import { createUserCard } from "../../../components/cards/UserCard/UserCard.js";
import BaseView from "../../basics/BaseView/BaseView.js";
import EventBus from "../../services/EventBus/EventBus.js";
import { 
    REDIRECT 
} from "../../services/EventBus/EventTypes.js";

export default class PeopleView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._main = null;

        this._initEventHandlers();
    }

    _initEventHandlers() {
        this._eventHandlers = {
        }
    }

    // TODO(template)
    render(cards) {
        const main = document.createElement('main');
        main.classList.add('main'); 
        this.parent.appendChild(main);

        this._main = main;

        cards.forEach(item => {
            const userCard = createUserCard(item);
            userCard.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.id}`});
            });
            main.appendChild(userCard);
        });

    }

    erase() {
        if (this._main !== null) {
            this._main.remove();
        }
    }

    registerEvents() {
    }

    unRegisterEvents() {
    }
}