'use strict';

import { createMeetCard } from "../../cards/MeetCard/MeetCard.js";
import { createUserCard } from "../../cards/UserCard/UserCard.js";
import { createCollectionCard } from "@/components/cards/CollectionCard/CollectionCard";
import {TAGS_IMGS} from "@/js/config/tags";


export default class CardWrapper {
    constructor(isMobile, column, buttonAction) {
        this._isMobile = isMobile;
        this._column = column;
        this._buttonAction = buttonAction;
        this._cards = null;
        if (isMobile) {
            this._createMobile();
        } else {
            this._createDesktop();
        }
    }

    render() {
        return this._this;
    }

    appendCard(data, action, likeAction) {
        const newCard = createMeetCard(data, this._isMobile);
        newCard.addEventListener('click', action);

        const meetCardLikeIcon = newCard.getElementsByClassName('meet-card__like')[0];
        meetCardLikeIcon.addEventListener('click', likeAction);

        this._cards.appendChild(newCard);
    }

    appendUserCard(data, action) {
        const newCard = createUserCard(data);
        newCard.addEventListener('click', action);

        this._cards.appendChild(newCard);
    }

    appendCollection(key, action) {
        const newCollection = createCollectionCard({name: key, imgSrc: TAGS_IMGS[key]});
        newCollection.addEventListener('click', action);

        this._cards.appendChild(newCollection);
    }

    removeButton() {
        this._button.remove();
    }

    addEmptyBlock() {
        const element = document.createElement('h1');
        element.innerHTML = 'К сожалению ничего не нашлось :(';
        element.classList.add();

        this._cards.appendChild(element);
    }

    getLastItemId() {
        if (this._cards.childElementCount !== 0) {
            return this._cards.lastElementChild.id;
        }
        return -1;
    }

    clear() {
        this._this.innerHTML = '';
    }

    remove() {
        this._this.remove();
    }

    _createMobile() {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper-mobile');

        const cards = document.createElement('div');
        if (this._column) {
            cards.classList.add('card-wrapper-mobile__cards_column');
            const button = document.createElement('button');
            button.classList.add('card-wrapper-mobile__button')
            button.innerHTML = 'Загрузить еще';

            cardWrapper.appendChild(cards);

            if (this._buttonAction !== null && this._buttonAction !== undefined) {
                this._button = button;
                button.addEventListener('click', this._buttonAction);
                cardWrapper.appendChild(button);
            }
        } else {
            cards.classList.add('card-wrapper-mobile__cards');
            cardWrapper.append(cards);
        }

        this._cards = cards;
        this._this = cardWrapper;
    }

    _createDesktop() {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper')

        const cards = document.createElement('div');
        cards.classList.add('card-wrapper__cards');

        const button = document.createElement('button');
        button.classList.add('card-wrapper__button');
        button.innerHTML = 'Загрузить еще';

        cardWrapper.appendChild(cards);

        if (this._buttonAction !== null && this._buttonAction !== undefined) {
            this._button = button;
            button.addEventListener('click', this._buttonAction);
            cardWrapper.appendChild(button);
        }

        this._cards = cards;
        this._this = cardWrapper;
    }
}
