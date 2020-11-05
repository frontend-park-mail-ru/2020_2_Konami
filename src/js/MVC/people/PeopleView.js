'use strict';

import { createUserCard } from "../../../components/cards/UserCard/UserCard.js";
import { createSettings } from "../../../components/settings/Settings.js";
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
        this._this = null;
        this._settingsButton = [
            {
                view: 'Мои люди',
                param: 'mymeetings',
            }, 
            {
                view: 'Избранные люди',
                param: 'favotites'
            },
            {
                view: 'Еще какие-то люди',
                param: 'today',
            },
            {
                view: 'Кенты',
                param: 'tomorrow',
            },
            {
                view: 'Какие-то настройки',
                param: 'tomorrow',
            },
            {
                view: 'Eще какие-то настройки',
                param: 'tomorrow',
            },
            {
                view: 'Возможно еще настройки',
                param: 'tomorrow',
            },
            {
                view: 'И еще',
                param: 'tomorrow',
            },
        ];
    }

    render(cards) {
        const main = document.createElement('main');
        main.classList.add('main'); 
        this.parent.appendChild(main);

        main.appendChild(this._createSettings());

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');
        main.appendChild(cardWrapper);

        this._this = main;

        cards.forEach(item => {
            const userCard = createUserCard(item);
            userCard.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.id}`});
            });
            cardWrapper.appendChild(userCard);
        });

    }

    _createSettings() {
        return createSettings(this._settingsButton, () => {});
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}