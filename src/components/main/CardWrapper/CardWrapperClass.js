'use strict';

import { createMeetCard } from "../../cards/MeetCard/MeetCard.js";

export default class CardWrapper {
    constructor(isMobile, column) {
        this._isMobile = isMobile;
        this._column = column;
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

        this._this.appendChild(newCard);
    }

    clear() {
        this._this.innerHTML = '';
    }

    remove() {
        this._this.remove();
    }

    _createMobile() {
        const cardWrapper = document.createElement('div');
        if (this._column) {
            cardWrapper.classList.add('card-wrapper-mobile_column');
        } else {
            cardWrapper.classList.add('card-wrapper-mobile');
        }

        this._this = cardWrapper;
    }

    _createDesktop() {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');

        this._this = cardWrapper;
    }
};