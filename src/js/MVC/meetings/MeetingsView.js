'use strict';

import { createMeetCard } from "@/components/cards/MeetCard/MeetCard.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { getMeetings } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { patchMeeting } from "@/js/services/API/api.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { 
    REDIRECT,
    OPEN_LOGIN_MODAL,
} from "@/js/services/EventBus/EventTypes.js";

import {
    createSettings
} from "@/components/settings/Settings.js";

import { createMainTitle } from "../../../components/main/MainTitle/CreateMainTitle";
import CardWrapper from "../../../components/main/CardWrapper/CardWrapperClass.js";

import Slider from "../../../components/cards/MeetSlides/MeetSlidesClass.js";

export default class MeetingsView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._this = null;
        this._slider = null;

        this._settingsButton = [
            {view: 'Мои мероприятия', type: ['filter'], value: 'mymeetings',}, 
            {view: 'Избранное', type: ['filter'], value: 'favorites',},
            {view: 'Сегодня', type: ['dateStart', 'dateEnd'], value: new Date().toISOString().slice(0, 10),},
            {view: 'Завтра', type: ['dateStart', 'dateEnd'], value: new Date().toISOString().slice(0, 10),},
            {view: 'Убрать фильтры', type: 'clear',}
        ];
    }

    renderWithQuery(cards) {
        const mobile = true;
        if (mobile) {
            this._renderWithQueryMobile(cards);
        } else {
            this._renderWithQueryDesktop(cards);
        }
    }

    render(recomendation, soon, mostExpected) {
        const mobile = true;

        if (mobile) {
            this._renderMobile(soon, mostExpected);
        } else {
            this._renderDesktop(soon, mostExpected);
        }
        recomendation.forEach(item => {
            this._createSlide(item);
        });
    }

    _renderWithQueryMobile(cards) {
        const main = document.createElement('div');
        main.classList.add('page-mobile__main');
        this.parent.appendChild(main);
        this._this = main;

        this._slider = new Slider(true);
        main.appendChild(this._slider.render());

        cards.forEach(item => {
            this._createSlide(item);
        });

        const afterCard = document.createElement('div');
        afterCard.classList.add('page-mobile__after-card');
        main.appendChild(afterCard);

        afterCard.appendChild(this._createSettings(this._settingsButton));

        let cardsW = new CardWrapper(true, true);
        afterCard.appendChild(cardsW.render());
        cards.forEach(item => {
            this._createCard(item, cardsW);
        });
    }

    _renderWithQueryDesktop() {
        // Создаем страницу
        const main = document.createElement('div');
        main.classList.add('meet-page__main'); 
        this.parent.appendChild(main);
        this._this = main;

        // Настройки
        main.appendChild(this._createSettings(this._settingsButton));

        // Карточки 
        let cards = new CardWrapper(false, false);
        main.appendChild(cards.render());
        cards.forEach(item => {
            this._createCard(item, cards);
        });
    }

    _renderMobile(soon, mostExpected) {
        // Создаем страницу
        const main = document.createElement('div');
        main.classList.add('page-mobile__main');
        this.parent.appendChild(main);
        this._this = main;

        // Создаем слайдер
        this._slider = new Slider(true);
        main.appendChild(this._slider.render());

        // Создаем контере для карточек, заголовков, настроек
        const afterCard = document.createElement('div');
        afterCard.classList.add('page-mobile__after-card');
        main.appendChild(afterCard);

        // Заголовок
        afterCard.appendChild(createMainTitle('Митапы в ближайшее время'));

        // Настройки
        afterCard.appendChild(this._createSettings(this._settingsButton));

        // Карточки 
        let cards = new CardWrapper(true, false);
        afterCard.appendChild(cards.render());
        soon.forEach(item => {
            this._createCard(item, cards);
        });

        afterCard.appendChild(createMainTitle('Самые ожидаемые'));
        cards = new CardWrapper(true, false);
        afterCard.appendChild(cards.render());
        mostExpected.forEach(item => {
            this._createCard(item, cards);
        });
    }

    _renderDesktop(soon, mostExpected) {
        // Создаем страницу
        const main = document.createElement('div');
        main.classList.add('meet-page__main'); 
        this.parent.appendChild(main);
        this._this = main;

        // Заголовок
        main.appendChild(createMainTitle('Рекомендации для вас'));

        // Настройки
        main.appendChild(this._createSettings(this._settingsButton));

        // Создаем слайдер
        this._slider = new Slider(false);
        main.appendChild(this._slider.render());
    
        // Заголовок
        main.appendChild(createMainTitle('Митапы в ближайшее время'));
        // Карточки 
        let cards = new CardWrapper(false, false);
        main.appendChild(cards.render());
        soon.forEach(item => {
            this._createCard(item, cards);
        });

        main.appendChild(createMainTitle('Самые ожидаемые'));
        cards = new CardWrapper(false, false);
        main.appendChild(cards.render());
        mostExpected.forEach(item => {
            this._createCard(item, cards);
        });
    }

    _createSlide(item) {
        this._slider.appendSlide(
            item, 
            () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
            },
            this._likeEventListener.bind(this, item),
            this._goEventListener.bind(this, item),
        );
    }

    _createCard(item, cards) {
        cards.appendCard(
            item,
            () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
            },
            this._likeEventListener.bind(this, item),
        );
    }

    _createSettings() {
        const settings = createSettings(this._settingsButton, (obj) => {
            if (obj.type === 'clear') {
                EventBus.dispatchEvent(REDIRECT, {url: `/meetings`});
                return;
            }

            for (let item of obj.type) {
                this.model._queryConfig[item] = obj.value;
            }

            let result = '?';
            for (let item of Object.keys(this.model._queryConfig)) {
                if (this.model._queryConfig[item] === null) {
                    continue;
                }
                result += `${item}=${this.model._queryConfig[item]}&`;
            }
            EventBus.dispatchEvent(REDIRECT, {url: `/meetings` + result.slice(0, -1)});
        });

        return settings;
    }

    _likeEventListener(item, event) {
        event.preventDefault();
        event.stopPropagation();
        this.model.checkAuth().then(isAuth => {
            if (!isAuth) {
                EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                return;
            }

            if (item.isLiked) {
                item.isLiked = false;
            } else {
                item.isLiked = true;
            }

            patchMeeting({
                meetId: item.card.label.id,
                fields: {
                    isLiked: item.isLiked,
                },
            }).then(obj => {
                if (obj.statusCode !== 200) {
                    alert('Permission denied');
                    return;
                }
                if (item.isLiked) {
                    displayNotification("Вы оценили мероприятие");
                    if (event.target.src) {
                        event.target.src = "/assets/like.svg";
                    } else {
                        event.target.firstElementChild.src = "/assets/like.svg";
                    }
                } else {
                    displayNotification("Вы убрали лайк"); 
                    if (event.target.src) {
                        event.target.src = "/assets/heart.svg";;
                    } else {
                        event.target.firstElementChild.src = "/assets/heart.svg";;
                    }
                }
            });
        });
    }

    _goEventListener(item, event) {
        event.preventDefault();
        event.stopPropagation();
        this.model.checkAuth().then(isAuth => {
            if (!isAuth) {
                EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                return;
            }
            if (item.isRegistered) {
                item.isRegistered = false;
            } else {
                item.isRegistered = true;
            }

            patchMeeting({
                meetId: item.card.label.id,
                fields: {
                    isRegistered: item.isRegistered,
                },
            }).then(obj => {
                if (obj.statusCode === 200) {
                    if (item.isRegistered) {
                        displayNotification("Зарегистрировалиь");
                        event.target.innerHTML = 'Отменить';
                    } else {
                        displayNotification("Вы отменили регистрацию");
                        event.target.innerHTML = 'Пойти';
                    }
                } else if (obj.statusCode === 409) {
                    displayNotification("Мероприятие уже завершилось");
                } else {
                    alert('Permission denied');
                }
            });
            
        });
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}