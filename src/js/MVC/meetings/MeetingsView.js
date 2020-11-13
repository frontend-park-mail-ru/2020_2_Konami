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
import { createSlides } from "../../../components/cards/MeetSlides/MeetSlides/MeetSlides";
import { createSlide } from "../../../components/cards/MeetSlides/MeetSlide/MeetSlide";
import { createMainTitle } from "../../../components/main/MainTitle/CreateMainTitle";
import { createCardWrapper } from "../../../components/main/CardWrapper/CardWrapper";
import { createSlidesMobile } from "../../../components/cards/MeetSlides/MeetSlides/MeetSlidesMobile";
import { createCardWrapperMobile } from "../../../components/main/CardWrapper/CardWrapperMobile";

export default class MeetingsView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._this = null;
        this._cards = null;
        this._slides = null;

        this._settingsButton = [
            {view: 'Мои мероприятия', param: 'mymeetings'}, 
            {view: 'Избранное', param: 'favorites'},
            {view: 'Сегодня', param: 'today'},
            {view: 'Завтра', param: 'tomorrow'},
        ];
    }

    render(cards) {
        const mobile = true;
        if (mobile) {
            const main = document.createElement('div');
            main.classList.add('page-mobile__main');
            this.parent.appendChild(main);
            this._this = main;

            this._slides = createSlidesMobile();
            main.appendChild(this._slides);

            const afterCard = document.createElement('div');
            afterCard.classList.add('page-mobile__after-card');
            afterCard.appendChild(createMainTitle('Рекомендации для вас'));
            afterCard.appendChild(this._createSettings(this._settingsButton));
            main.appendChild(afterCard);

            this._cards = createCardWrapperMobile();
            afterCard.appendChild(this._cards);

            cards.forEach(item => {
                this._createSlideMobile(item);
                this._createCard(item, true);
            });
            return;
        } 

        const main = document.createElement('div');
        main.classList.add('meet-page__main-mobile');
        main.classList.add('meet-page__main'); 
        this.parent.appendChild(main);
        this._this = main;

        main.appendChild(createMainTitle('Рекомендации для вас'));
        main.appendChild(this._createSettings(this._settingsButton));
        main.appendChild(createSlides());
    
        main.appendChild(createMainTitle('Митапы в ближайшее время'));
        this._cards = createCardWrapper();
        main.appendChild(this._cards);

        this._slides = main.getElementsByClassName('slide-container__slides')[0];

        cards.forEach(item => {
            this._createSlide(item);
            this._createCard(item);
        });
    }

    _createSlide(item) {
        const meetSlide = createSlide(item, false);
        meetSlide.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
        });
        this._slides.appendChild(meetSlide);

        const likeIcon = meetSlide.getElementsByClassName('meet-slide__like-icon-wrapper')[0];
        likeIcon.addEventListener('click', (event) => {
            this._likeEventListener(event, item, likeIcon.firstChild);
        });

        const goButton = meetSlide.getElementsByClassName('meet-slide__go-button')[0];
        goButton.addEventListener('click', (event) => {
            this._goEventListener(event, item, goButton);
        });
    }

    _createCard(item, isMobile) {
        const meetCard = createMeetCard(item, isMobile);
        meetCard.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
        });
        this._cards.appendChild(meetCard);

        const meetCardLikeIcon = meetCard.getElementsByClassName('meet-card__like')[0];
        meetCardLikeIcon.addEventListener('click', (event) => {
            this._likeEventListener(event, item, meetCardLikeIcon);
        });
    }

    _createSlideMobile(item) {
        const meetSlide = createSlide(item, true);
        meetSlide.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
        });
        this._slides.appendChild(meetSlide);

        const likeIcon = meetSlide.getElementsByClassName('meet-slide-mobile__like-icon')[0];
        likeIcon.addEventListener('click', (event) => {
            this._likeEventListener(event, item, likeIcon);
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

    _likeEventListener(event, item, likeIcon) {
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
                    likeIcon.src = "/assets/like.svg";
                } else {
                    displayNotification("Вы убрали лайк"); 
                    likeIcon.src = "/assets/heart.svg";
                }
            });
        });
    }

    _goEventListener(event, item, goButton) {
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
                        goButton.innerHTML = 'Отменить';
                    } else {
                        displayNotification("Вы отменили регистрацию");
                        goButton.innerHTML = 'Пойти';
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