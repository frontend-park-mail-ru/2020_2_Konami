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
            // тут нужно описать действие которое будет выполненино при нажатие на кнопку загрузить еще
        });
        this._cards = cardWrapper;

        main.appendChild(cardWrapper.render());
        cards.forEach(item => {
            cardWrapper.appendUserCard(item, () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
            });
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
            // тут нужно описать действие которое будет выполненино при нажатие на кнопку загрузить еще
        });
        this._cards = cardWrapper;

        afterCard.appendChild(cardWrapper.render());
        cards.forEach(item => {
            cardWrapper.appendUserCard(item, () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
            });
        });
    }

    _createSettings() {
        const settings = createSettings();

        const myPeople = createButton('Moи люди');
        const favoritePeople = createButton('Избранные люди');

        settings.append(myPeople, favoritePeople);

        return settings;
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}