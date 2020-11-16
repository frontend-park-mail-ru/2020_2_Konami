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
        this._cards = null;
        this._slider = null;

        this._settingsButton = [
            {view: 'Мои мероприятия', param: 'mymeetings'}, 
            {view: 'Избранное', param: 'favorites'},
            {view: 'Сегодня', param: 'today'},
            {view: 'Завтра', param: 'tomorrow'},
        ];
    }

    render(cards, queryParams) {
        if (queryParams) {

        }

        const mobile = true;
        if (mobile) {
            this._renderMobile();
        } else {
            this._renderDesktop();
        }

        cards.forEach(item => {
            this._createSlide(item);
            this._createCard(item, this._cards);
        });
    }

    _renderMobile() {
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
        this._cards = new CardWrapper(true, true);
        afterCard.appendChild(this._cards.render());
    }

    _renderDesktop() {
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
        this._cards = new CardWrapper(false, false);
        main.appendChild(this._cards.render())
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
                        EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
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