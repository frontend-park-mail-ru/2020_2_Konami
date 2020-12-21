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
import {TAGS, TAGS_IMGS} from "@/js/config/tags";

export const MEETINGSCOUNT = 9;

export class MeetingsView extends BaseView {
    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._this = null;
        this._slider = null;
        this._cards = null;

        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        console.log(tomorrow);

        this._settingsButton = [
            {view: 'Мои мероприятия', type: ['filter'], value: 'my',},
            {view: 'Избранное', type: ['filter'], value: 'favorite',},
            {view: 'Сегодня', type: ['dateStart', 'dateEnd'], value: today.toISOString().slice(0, 10),},
            {view: 'Завтра', type: ['dateStart', 'dateEnd'], value: tomorrow.toISOString().slice(0, 10),},
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

        const slider = document.getElementsByClassName('slide-container')[0];
        const sliderItems = document.getElementsByClassName('slide-container__slides')[0];
        const prev = document.getElementsByClassName('slide-container__prev-button')[0];
        const next = document.getElementsByClassName('slide-container__next-button')[0];

        this._slider.slide(slider, sliderItems, prev, next);
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

        if (cards.length === 0) {
            this._slider.appendEmptySlide();
        }

        // Создаем контере для карточек, заголовков, настроек
        const afterCard = document.createElement('div');
        afterCard.classList.add('page-mobile__after-card');
        main.appendChild(afterCard);

        afterCard.appendChild(this._createSettings(this._settingsButton));
        if (this.model._queryConfig.collectionId !== undefined &&
                this.model._queryConfig.collectionId !== null &&
                this.model._queryConfig.collectionId !== '') {
            main.appendChild(createMainTitle(this.model._queryConfig.collectionId));
        }

        // Сами карточки выводятся сверху вниз
        let cardsW = new CardWrapper(true, true, () => {
            console.log(cardsW.getLastItemDate());
            getMeetings({
                limit: MEETINGSCOUNT,
                start: this.model._queryConfig.dateStart,
                end: this.model._queryConfig.dateEnd,
                tagId: this.model._queryConfig.tagId,
                meetId: this.model._queryConfig.meetId,
                prevId: cardsW.getLastItemId(),
                prevStart: cardsW.getLastItemDate(),
            }, this.model._queryConfig.filter).then(obj => {
                if (obj.parsedJson.length < MEETINGSCOUNT) {
                    cardsW.removeButton();
                }
                obj.parsedJson.forEach(element => {
                    this._createCard(element, cardsW);
                });
            });
        });
        afterCard.appendChild(cardsW.render());
        if (cards.length < MEETINGSCOUNT) {
            cardsW.removeButton();
        }
        if (cards.length === 0) {
            cardsW.addEmptyBlock();
        }
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
        if (this.model._queryConfig.collectionId !== undefined &&
                this.model._queryConfig.collectionId !== null &&
                this.model._queryConfig.collectionId !== '') {
            main.appendChild(createMainTitle(this.model._queryConfig.collectionId));
        }

        // Карточки
        let cardsW = new CardWrapper(false, false, () => {
            console.log(cardsW.getLastItemDate());
            getMeetings({
                limit: MEETINGSCOUNT,
                start: this.model._queryConfig.dateStart,
                end: this.model._queryConfig.dateEnd,
                tagId: this.model._queryConfig.tagId,
                meetId: this.model._queryConfig.meetId,
                prevId: cardsW.getLastItemId(),
                prevStart: cardsW.getLastItemDate(),
            }, this.model._queryConfig.filter).then(obj => {
                if (obj.parsedJson.length < MEETINGSCOUNT) {
                    cardsW.removeButton();
                }
                obj.parsedJson.forEach(element => {
                    this._createCard(element, cardsW);
                });
            });
        });
        main.appendChild(cardsW.render());
        if (cards.length < MEETINGSCOUNT) {
            cardsW.removeButton();
        }
        if (cards.length === 0) {
            cardsW.addEmptyBlock();
        }
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
        if (this.model._queryConfig.collectionId !== undefined &&
                this.model._queryConfig.collectionId !== null &&
                this.model._queryConfig.collectionId !== '') {
            main.appendChild(createMainTitle(this.model._queryConfig.collectionId));
        }

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

        const collectionsTitle = createMainTitle('Подборки');
        afterCard.appendChild(collectionsTitle);

        let collections = new CardWrapper(true, false);
        afterCard.appendChild(collections.render());

        const keys = Object.keys(TAGS);
        keys.forEach(key => {
            collections.appendCollection(key, () => {
                this.model._queryConfig.collectionId = key;
                this.model._queryConfig.filter = 'tagged';
                this._parseWithRedirect();
            });
        });
    }

    _renderDesktop(soon, mostExpected) {
        // Создаем страницу
        const main = document.createElement('div');
        main.classList.add('desktop-page');
        this.parent.appendChild(main);
        this._this = main;

        main.appendChild(createEmptyBlock());


        const recommended = createMainTitle('Рекомендации для вас');
        /* recommended.addEventListener('click', () => {
            this.model._queryConfig.filter = 'recommended';
            this._parseWithRedirect();
        }); */
        // Заголовок
        main.appendChild(recommended);


        // Настройки
        main.appendChild(this._createSettings(this._settingsButton));
        if (this.model._queryConfig.collectionId !== undefined &&
                this.model._queryConfig.collectionId !== null &&
                this.model._queryConfig.collectionId !== '') {
            main.appendChild(createMainTitle(this.model._queryConfig.collectionId));
        }

        // Создаем слайдер
        this._slider = new Slider(false);
        main.appendChild(this._slider.render());

        const soonTitle = createMainTitle('Митапы в ближайшее время');
        soonTitle.addEventListener('click', () => {
            this.model._queryConfig.dateStart = new Date().toISOString().slice(0, 10);
            this._parseWithRedirect();
        });
        // Заголовок
        main.appendChild(soonTitle);

        // Карточки
        let cards = new CardWrapper(false, false);
        main.appendChild(cards.render());
        soon.forEach(item => {
            this._createCard(item, cards);
        });

        const top = createMainTitle('Самые ожидаемые');
        top.addEventListener('click', () => {
            this.model._queryConfig.filter = 'top';
            this._parseWithRedirect();
        });
        main.appendChild(top);

        cards = new CardWrapper(false, false);
        main.appendChild(cards.render());
        mostExpected.forEach(item => {
            this._createCard(item, cards);
        });

        const collectionsTitle = createMainTitle('Подборки');
        main.appendChild(collectionsTitle);

        let collections = new CardWrapper(false, false);
        main.appendChild(collections.render());

        const keys = Object.keys(TAGS);
        keys.forEach(key => {
            collections.appendCollection(key, () => {
                this.model._queryConfig.collectionId = key;
                this.model._queryConfig.filter = 'tagged';
                this._parseWithRedirect();
            });
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
        if (this.model._queryConfig.filter === 'my') {
            mymeetings.style.backgroundColor = '#e5e5e5';
        }

        mymeetings.addEventListener('click', () => {
            this.model.checkAuth().then(isAuth => {
                if (!isAuth) {
                    EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    return;
                }
                this.model._queryConfig.filter = 'my';
                this._parseWithRedirect();
            });
        });

        const favorites = createButton('Избранное');
        if (this.model._queryConfig.filter === 'favorite') {
            favorites.style.backgroundColor = '#e5e5e5';
        }

        favorites.addEventListener('click', () => {
            this.model.checkAuth().then(isAuth => {
                if (!isAuth) {
                    EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    return;
                }
                this.model._queryConfig.filter = 'favorite';
                this._parseWithRedirect();
            });
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
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            this.model._queryConfig.dateStart = tomorrow.toISOString().slice(0, 10);
            this.model._queryConfig.dateEnd = tomorrow.toISOString().slice(0, 10);

            this._parseWithRedirect();
        });

        const dateEnd = document.createElement('input');
        if (this.model._queryConfig.dateEnd !== undefined &&
                this.model._queryConfig.dateEnd !== null &&
                this.model._queryConfig.dateEnd !== '') {
            dateEnd.value = this.model._queryConfig.dateEnd;
            dateEnd.style.backgroundColor = '#e5e5e5';
        }
        dateEnd.type = 'date';
        dateEnd.classList.add('settings__button');
        dateEnd.min = new Date().toISOString().slice(0, 10);
        if (this.model._queryConfig.dateEnd !== undefined &&
                this.model._queryConfig.dateEnd !== null &&
                this.model._queryConfig.dateEnd !== '') {
            dateEnd.value = this.model._queryConfig.dateEnd;
            dateEnd.style.backgroundColor = '#e5e5e5';;
        }
        dateEnd.addEventListener('change', () => {
            this.model._queryConfig.dateEnd = dateEnd.value;

            this._parseWithRedirect();
        });

        const dateStart = document.createElement('input');
        if (this.model._queryConfig.dateStart !== null &&
                this.model._queryConfig.dateStart !== undefined &&
                    this.model._queryConfig.dateStart !== '') {
            dateStart.value = this.model._queryConfig.dateStart;
            dateStart.style.backgroundColor = '#e5e5e5';;
        }
        dateStart.type = 'date';
        dateStart.classList.add('settings__button');
        dateStart.min = new Date().toISOString().slice(0, 10);
        if (this.model._queryConfig.dateStart !== null &&
                this.model._queryConfig.dateStart !== '' &&
                this.model._queryConfig.dateStart !== undefined) {
            dateStart.value = this.model._queryConfig.dateStart;
            dateStart.style.backgroundColor = '#e5e5e5';;
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
                        event.target.src = "/assets/heart.svg";
                    } else {
                        event.target.firstElementChild.src = "/assets/heart.svg";
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
