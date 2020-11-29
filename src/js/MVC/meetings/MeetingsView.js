'use strict';

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
    createSettings,
    createButton,
} from "@/components/settings/Settings.js";

import { createMainTitle } from "../../../components/main/MainTitle/CreateMainTitle";
import CardWrapper from "../../../components/main/CardWrapper/CardWrapperClass.js";

import Slider from "../../../components/cards/MeetSlides/MeetSlidesClass.js";
import { createEmptyBlock } from "../../../components/main/EmptyBlock/EmptyBlock";

export default class MeetingsView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._this = null;
        this._slider = null;
        this._cards = null;

        this._settingsButton = [
            {view: 'Мои мероприятия', type: ['filter'], value: 'mymeetings',}, 
            {view: 'Избранное', type: ['filter'], value: 'favorites',},
            {view: 'Сегодня', type: ['dateStart', 'dateEnd'], value: new Date().toISOString().slice(0, 10),},
            {view: 'Завтра', type: ['dateStart', 'dateEnd'], value: new Date().toISOString().slice(0, 10),},
            {view: 'Убрать фильтры', type: 'clear',}
        ];
    }

    renderWithQuery(cards) {
        if (this.model.isMobile()) {
            this._renderWithQueryMobile(cards);
        } else {
            this._renderWithQueryDesktop(cards);
        }
    }

    render(recomendation, soon, mostExpected) {
        if (this.model.isMobile()) {
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
        
        // Создаем контере для карточек, заголовков, настроек
        const afterCard = document.createElement('div');
        afterCard.classList.add('page-mobile__after-card');
        main.appendChild(afterCard);

        afterCard.appendChild(this._createSettings(this._settingsButton));

        // Сами карточки выводятся сверху вниз
        let cardsW = new CardWrapper(true, true, () => {
            // тут нужно описать действие которое будет выполненино при нажатие на кнопку загрузить еще
        });
        afterCard.appendChild(cardsW.render());
        cards.forEach(item => {
            this._createCard(item, cardsW);
        });

        this._cards = cardsW;
    }

    _renderWithQueryDesktop(cards) {
        // Создаем страницу
        const main = document.createElement('div');
        main.classList.add('desktop-page'); 
        this.parent.appendChild(main);
        this._this = main;

        main.appendChild(createEmptyBlock());

        // Настройки
        main.appendChild(this._createSettings(this._settingsButton));

        // Карточки 
        let cardsW = new CardWrapper(false, false, () => {
            // тут нужно описать действие которое будет выполненино при нажатие на кнопку загрузить еще
        });
        main.appendChild(cardsW.render());
        cards.forEach(item => {
            this._createCard(item, cardsW);
        });

        this._cards = cardsW;
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

        // Карточки слево направо
        let cards = new CardWrapper(true, false, () => {
            // тут нужно описать действие которое будет выполненино при нажатие на кнопку загрузить еще
        });
        afterCard.appendChild(cards.render());
        soon.forEach(item => {
            this._createCard(item, cards);
        });

        // Карточки слево направо
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
        main.classList.add('desktop-page'); 
        this.parent.appendChild(main);
        this._this = main;

        main.appendChild(createEmptyBlock());

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
        const mymeetings = createButton('Мои мероприятия');

        mymeetings.addEventListener('click', () => {
            this.model._queryConfig.filter = 'mymeetings';
            this._parseWithRedirect();
        });

        const favorites = createButton('Избранное');

        favorites.addEventListener('click', () => {
            this.model._queryConfig.filter = 'favorites';
            
            this._parseWithRedirect();
        });

        const settings = document.createElement('div');
        settings.classList.add('settings');

        const today = createButton('Сегодня');
        today.addEventListener('click', () => {
            this.model._queryConfig.dateStart = new Date().toISOString().slice(0, 10);
            this.model._queryConfig.dateEnd = new Date().toISOString().slice(0, 10);

            this._parseWithRedirect();
        });

        const tomorrow = createButton('Завтра');
        tomorrow.addEventListener('click', () => {
            this.model._queryConfig.dateStart = new Date().toISOString().slice(0, 10);
            this.model._queryConfig.dateEnd = new Date().toISOString().slice(0, 10);

            this._parseWithRedirect();
        });

        const dateEnd = document.createElement('input');
        if (this.model._queryConfig.dateEnd !== undefined) {
            dateEnd.value = this.model._queryConfig.dateEnd;
        }
        dateEnd.type = 'date';
        dateEnd.classList.add('settings__button');
        dateEnd.min = new Date().toISOString().slice(0, 10);
        if (this.model._queryConfig.dateEnd !== null) {
            dateEnd.value = this.model._queryConfig.dateEnd;
        }
        dateEnd.addEventListener('change', () => {
            this.model._queryConfig.dateEnd = dateEnd.value;

            this._parseWithRedirect();
        });

        const dateStart = document.createElement('input');
        if (this.model._queryConfig.dateStart !== undefined) {
            dateStart.value = this.model._queryConfig.dateStart;
        }
        dateStart.type = 'date';
        dateStart.classList.add('settings__button');
        dateStart.min = new Date().toISOString().slice(0, 10);
        if (this.model._queryConfig.dateStart !== null) {
            dateStart.value = this.model._queryConfig.dateStart;
        }
        dateStart.addEventListener('change', () => {
            if (dateEnd.value < dateStart.value) {
                dateEnd.value = dateStart.value;
                this.model._queryConfig.dateEnd = dateStart.value;
            }

            dateEnd.min = dateStart.value;

            this.model._queryConfig.dateStart = dateStart.value;
            this._parseWithRedirect();
        });

        const clear = createButton('Убрать фильтры');
        clear.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: `/meetings`});
        });

        settings.append(mymeetings, favorites, today, tomorrow, clear, dateStart, dateEnd);

        return settings;
    }

    _renderCards() {
        if (this._cards !== null) {
            this._cards.clear();
            this._parseWithRequest().then(obj => {
                obj.parsedJson.forEach(item => {
                    this._createCard(item, this._cards);
                });
            });
            return;
        }
        this._parseWithRedirect();
    }

    _parseWithRedirect() {
        let result = '?';
        for (let item of Object.keys(this.model._queryConfig)) {
            if (this.model._queryConfig[item] === null) {
                continue;
            }
            result += `${item}=${this.model._queryConfig[item]}&`;
        }
        EventBus.dispatchEvent(REDIRECT, {url: `/meetings` + result.slice(0, -1)});
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