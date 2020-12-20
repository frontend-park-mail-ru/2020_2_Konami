'use strict';

import { 
    createSettings,
    createButton,
} from "@/components/settings/Settings.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { 
    REDIRECT 
} from "@/js/services/EventBus/EventTypes.js";
import CardWrapper from "../../../components/main/CardWrapper/CardWrapperClass";
import { createEmptyBlock } from "../../../components/main/EmptyBlock/EmptyBlock";
import { createMainTitle } from "../../../components/main/MainTitle/CreateMainTitle";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { getPeople, getSubscriptions, postSubscribeUser } from "../../services/API/api";

const PEOPLECOUNT = 9;

export default class PeopleView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
        this._cards = null;
    }

    render(cards) {
        if (this.model.isMobile()) {
            this._renderMobile(cards);
        } else {
            this._renderDesktop(cards);
        }
    }

    _renderDesktop(cards) {
        const main = document.createElement('div');
        main.classList.add('desktop-page'); 
        this._this = main;
        this.parent.appendChild(main);

        main.appendChild(createEmptyBlock());

        main.appendChild(createMainTitle('Людишечки'));

        // Добавляем немного настроечек
        main.appendChild(this._createSettings());

        const cardWrapper = new CardWrapper(this.model.isMobile(), true, () => {
            getPeople({
                limit: PEOPLECOUNT,
                prevId: cardWrapper.getLastItemId(),
            }).then(response => {
                if (response.statusCode === 200) {
                    // kaef
                } else {
                    // ne kaef
                    return;
                }
                response.parsedJson.forEach(item => {
                    cardWrapper.appendUserCard(item, () => {
                        EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
                    });
                });
                if (response.parsedJson.length < PEOPLECOUNT) {
                    cardWrapper.removeButton();
                }
            });
        });
        this._cards = cardWrapper;

        main.appendChild(cardWrapper.render());
        if (cards.length === 0) {
            cardWrapper.addEmptyBlock();
        }
        if (cards.length < PEOPLECOUNT) {
            cardWrapper.removeButton();
        }
        cards.forEach(item => {
            cardWrapper.appendUserCard(item, () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
            }, this._likeEventListener.bind(this, item));
        });
    }

    _renderMobile(cards) {
        const main = document.createElement('div');
        main.classList.add('page-mobile__main'); 
        this._this = main;
        this.parent.appendChild(main);

        // Создаем обертку для Парижа
        const peopleMobile = document.createElement('div');
        peopleMobile.classList.add('people-mobile');
        main.appendChild(peopleMobile);

        // Создаем Париж
        const topImage = document.createElement('img');
        topImage.classList.add('people-mobile__top-image');
        topImage.src = 'assets/paris.jpg';
        peopleMobile.appendChild(topImage);

        // Создаем белую штучку которая будет создержать весь контент
        const afterCard = document.createElement('div');
        afterCard.classList.add('page-mobile__after-card');
        main.appendChild(afterCard);

        // Добавляем немного настроечек
        afterCard.appendChild(this._createSettings());

        const cardWrapper = new CardWrapper(this.model.isMobile(), true, () => {
            getPeople({
                limit: PEOPLECOUNT,
                prevId: cardWrapper.getLastItemId(),
            }).then(response => {
                if (response.statusCode === 200) {
                    // kaef
                } else {
                    // ne kaef
                    return;
                }
                response.parsedJson.forEach(item => {
                    cardWrapper.appendUserCard(item, () => {
                        EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
                    });
                });
                if (response.parsedJson.length < PEOPLECOUNT) {
                    cardWrapper.removeButton();
                }
            });
        });
        this._cards = cardWrapper;

        afterCard.appendChild(cardWrapper.render());
        if (cards.length === 0) {
            cardWrapper.addEmptyBlock();
        }
        if (cards.length < PEOPLECOUNT) {
            cardWrapper.removeButton();
        }
        cards.forEach(item => {
            cardWrapper.appendUserCard(item, () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
            }, this._likeEventListener.bind(this, item));
        });
    }

    _createSettings() {
        const settings = createSettings();

        const favoritePeople = createButton('Избранные люди');
        favoritePeople.addEventListener('click', () => {
            this._cards.clear();
            getSubscriptions().then(obj => {
                obj.parsedJson.forEach(item => {
                    this._cards.appendUserCard(item, () => {
                        EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
                    }, this._likeEventListener.bind(this, item));
                });
                if (obj.parsedJson.length < PEOPLECOUNT) {
                    this._cards.removeButton();
                }
                if (obj.parsedJson.length === 0) {
                    this._cards.addEmptyBlock();
                }
            });
        });

        settings.append(favoritePeople);

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

            if (item.isSubTarget) {
                item.isSubTarget = false;
            } else {
                item.isSubTarget = true;
            }

            postSubscribeUser(item.label.id, item.isSubTarget).then(obj => {
                if (obj.statusCode !== 200) {
                    alert('Permission denied');
                    return;
                }
                if (item.isSubTarget) {
                    displayNotification("Вы избрали пользователя");
                    event.target.src = "/assets/like.svg";
                } else {
                    displayNotification("Вы отменили избрание"); 
                    event.target.src = "/assets/heart.svg";
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