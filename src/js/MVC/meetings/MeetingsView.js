'use strict';

import { createMeetCard } from "@/components/cards/MeetCard/MeetCard.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { getMeetings } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { postMeet } from "@/js/services/API/api.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { 
    REDIRECT,
    OPEN_LOGIN_MODAL,
} from "@/js/services/EventBus/EventTypes.js";

import {
    createSettings
} from "@/components/settings/Settings.js";
import { createSlides } from "../../../components/cards/MeetSlides/MeetSlides/MeetSlides";
import { createMeetSlide } from "../../../components/cards/MeetSlides/MeetСarouselItem/MeetSlide";

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
        const main = document.createElement('div');
        main.classList.add('meet-page__main');
        this.parent.appendChild(main);

        main.appendChild(this._createSettings(this._settingsButton));

        const headTitle = document.createElement('h1');
        headTitle.classList.add('main-title');
        headTitle.innerHTML = 'Митапы рядом с вам';
        main.appendChild(headTitle);

        const slides = createSlides();
        main.appendChild(slides);

        const headTitle2 = document.createElement('h1');
        headTitle2.classList.add('main-title');
        headTitle2.innerHTML = 'Митапы в ближайшее время';
        main.appendChild(headTitle2);


        const slidesWrapper = slides.getElementsByClassName('slide-container__slides')[0];

        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('card-wrapper');
        main.appendChild(cardWrapper);


        this._this = main;
        this._cards = cardWrapper;

        cards.forEach(item => {
            const meetSlide = createMeetSlide(item);
            meetSlide.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/meet?meetId=${item.id}`});
            });
            slidesWrapper.appendChild(meetSlide);

            const likeIcon = meetSlide.getElementsByClassName('meet-slide__like-icon-wrapper')[0];
            likeIcon.addEventListener('click', (event) => {
                this._likeEventListener(event, item, likeIcon.firstChild);
            });

            const goButton = meetSlide.getElementsByClassName('meet-slide__go-button')[0];
            goButton.addEventListener('click', (event) => {
                this._goEventListener(event, item, goButton);
            });

            const meetCard = createMeetCard(item);
            meetCard.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/meet?meetId=${item.id}`});
            });

            const meetCardLikeIcon = meetCard.getElementsByClassName('meet-card__like')[0];
            meetCardLikeIcon.addEventListener('click', (event) => {
                this._likeEventListener(event, item, meetCardLikeIcon);
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

    _likeEventListener(event, item, likeIcon) {
        (() => {
            event.preventDefault();
            event.stopPropagation();
            this.model.checkAuth().then(isAuth => {
                if (isAuth) {
                    if (item.isLiked) {
                        item.isLiked = false;
                        
                        likeIcon.src = "/assets/heart.svg";
                    } else {
                        item.isLiked = true;
                        likeIcon.src = "/assets/like.svg";
                    }

                    postMeet({
                        meetId: item.id,
                        fields: {
                            isLiked: item.isLiked,
                        },
                    }).then(obj => {
                        if (obj.statusCode === 200) {
                            if (item.isLiked) {
                                displayNotification("Вы оценили мероприятие");
                            } else {
                                displayNotification("Вы убрали лайк"); 
                            }
                        } else {
                            alert('Permission denied');
                        }
                    });
                } else {
                    EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                }
            });
        })();
    }

    _goEventListener(event, item, goButton) {
        (() => {
            event.preventDefault();
            event.stopPropagation();
            this.model.checkAuth().then(isAuth => {
                if (isAuth) {
                    if (item.isRegistered) {
                        item.isRegistered = false;
                    } else {
                        item.isRegistered = true;
                    }

                    postMeet({
                        meetId: item.id,
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
                } else {
                    EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                }
            });
        })();
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}