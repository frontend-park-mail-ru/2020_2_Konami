'use strict';

import { createUserCard } from "@/components/cards/UserCard/UserCard.js";
import { createSettings } from "@/components/settings/Settings.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { 
    REDIRECT 
} from "@/js/services/EventBus/EventTypes.js";

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
        if (this.model.isMobile()) {
            main.classList.add('page-mobile__main'); 
        } else {
            main.classList.add('meet-page__main'); 
        }
        this._this = main;
        this.parent.appendChild(main);

        const peopleMobile = document.createElement('div');
        peopleMobile.classList.add('people-mobile');

        const topImage = document.createElement('img');
        topImage.classList.add('people-mobile__top-image');
        topImage.src = 'assets/paris.jpg';
        peopleMobile.appendChild(topImage);

        main.appendChild(peopleMobile);

        const afterCard = document.createElement('div');
        afterCard.classList.add('page-mobile__after-card');
        main.appendChild(afterCard);

        // main.appendChild(this._createSettings());

        const cardWrapper = document.createElement('div');
        if (this.model.isMobile()) {
            cardWrapper.classList.add('card-wrapper-mobile_column');
        } else {
            cardWrapper.classList.add('card-wrapper');
        }
        afterCard.appendChild(cardWrapper);


        cards.forEach(item => {
            const userCard = createUserCard(item);
            userCard.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
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