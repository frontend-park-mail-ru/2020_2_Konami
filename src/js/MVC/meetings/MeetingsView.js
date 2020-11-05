'use strict';

import { createMeetCard } from "@/components/cards/MeetCard/MeetCard.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { getMeetings } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { 
    REDIRECT 
} from "@/js/services/EventBus/EventTypes.js";

import {
    createSettings
} from "@/components/settings/Settings.js";

export default class MeetingsView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
        this._cards = null;
        this._settingsButton = [
            {
                view: 'Мои мероприятия',
                param: 'mymeetings',
            }, 
            {
                view: 'Избранное',
                param: 'favorites'
            },
            {
                view: 'Сегодня',
                param: 'today',
            },
            {
                view: 'Завтра',
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

        main.appendChild(this._createSettings(this._settingsButton));

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');
        main.appendChild(cardWrapper);

        this._this = main;
        this._cards = cardWrapper;

        cards.forEach(item => {
            const meetCard = createMeetCard(item);
            meetCard.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/meet?meetId=${item.id}`});
            });

            cardWrapper.appendChild(meetCard);
        });
    }

    _createSettings() {
        const settings = createSettings(this._settingsButton, (param) => {
            if (this._cards === null) {
                return;
            }
            this._cards.innerHTML = '';
            
            const p = {};
            p[param] = 'true';
    
            getMeetings(p).then(obj => {
                obj.parsedJson.forEach(item => {
                    const meetCard = createMeetCard(item);
                    meetCard.addEventListener('click', () => {
                        EventBus.dispatchEvent(REDIRECT, {url: `/meet?meetId=${item.id}`});
                    });
                    if (this._cards !== null) {
                        this._cards.appendChild(meetCard);
                    }
                });
            });
        });

        this.model.checkAuth().then(isAuth => {
            if (!isAuth) {
                settings.getElementsByClassName('mymeetings')[0].remove();
                settings.getElementsByClassName('favorites')[0].remove();
            }
        });

        return settings;
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}