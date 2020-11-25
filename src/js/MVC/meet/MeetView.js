'use strict';

import { createMeetPage } from "@/components/meet/meet.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { patchMeeting } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { createMainTitle } from "@/components/main/MainTitle/CreateMainTitle.js"
import CardWrapper from "../../../components/main/CardWrapper/CardWrapperClass.js"
import {
    OPEN_LOGIN_MODAL,
    REDIRECT,
    PASS_MEET_DATA_TO_EDIT
} from "@/js/services/EventBus/EventTypes.js";
import { createEmptyBlock } from "../../../components/main/EmptyBlock/EmptyBlock.js";

export default class MeetView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
        this._data = null;
    }

    render(data, simulars) {
        if (this.model.isMobile()) {
            this._renderMobile(data, simulars);
        } else {
            this._renderDesktop(data, simulars);
        }

        const likeIcon = this._this.getElementsByClassName('meet__like-icon-wrapper')[0] || 
                         this._this.getElementsByClassName('meet-mobile__like-icon-wrapper')[0];
        const goButton = this._this.getElementsByClassName('meet__button_go')[0];
        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        // тут нужно что то сделать с editbutton

        if (likeIcon !== undefined) {
            likeIcon.addEventListener('click', this._clickLikeHandler.bind(this, data));
        }
        if (goButton !== undefined) {
            goButton.addEventListener('click', this._clickGoButtonHandler.bind(this, data));
        }
        if (editButton !== undefined) {
            editButton.addEventListener('click', this._clickEditButtonHandler.bind(this));
        }
    }

    _renderDesktop(data, simulars) {
        this._data = data;
        this._this = createMeetPage(data, false);
        this.parent.appendChild(this._this);

        const cardWrapper = new CardWrapper(true, false);

        this._this.appendChild(cardWrapper.render());

        for (let item of simulars) {
            cardWrapper.appendCard(
                item,
                () => {
                    EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
                }, 
                this._clickLikeHandler.bind(this, item),
            );
        }
    }
    
    _renderMobile(data, simulars) {
        this._data = data;
        this._this = createMeetPage(data, true);
        this.parent.appendChild(this._this);

        const afterCard = this._this.getElementsByClassName('page-mobile__after-card')[0];
        afterCard.appendChild(createMainTitle('Похожие:'));

        const cardWrapper = new CardWrapper(true, false);
        afterCard.appendChild(cardWrapper.render());

        for (let item of simulars) {
            cardWrapper.appendCard(
                item,
                () => {
                    EventBus.dispatchEvent(REDIRECT, {url: `/meeting?meetId=${item.card.label.id}`});
                }, 
                this._clickLikeHandler.bind(this, item),
            );
        }
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
            this._removeEventListeners();
        }
    }

    _clickLikeHandler(item, event) {
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
                        event.target.src = '/assets/like.svg';
                    } else if (event.target.firstChild.src) {
                        event.target.firstChild.src = '/assets/like.svg';
                    } else {
                        event.target.parentElement.firstChild.src = '/assets/like.svg'
                    }
                } else {
                    displayNotification("Вы убрали лайк"); 
                    if (event.target.src) {
                        event.target.src = '/assets/heart.svg';
                    } else if (event.target.firstChild.src) {
                        event.target.firstChild.src = '/assets/heart.svg';
                    } else {
                        event.target.parentElement.firstChild.src = '/assets/heart.svg';
                    }
                }
            });
        });
    }

    _clickGoButtonHandler(item, event) {
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

    _clickEditButtonHandler(evt) {
        EventBus.dispatchEvent(REDIRECT, {url: '/edit-meeting'});
        setTimeout(() => {
            EventBus.dispatchEvent(PASS_MEET_DATA_TO_EDIT, this._data);
        }, 500); // таймаут нужен из за checkAuth, который промис возвращает(((
    }

    _removeEventListeners() {
        const likeIcon = this._this.getElementsByClassName('meet__like-icon')[0];
        if (likeIcon !== undefined) {
            likeIcon.removeEventListener('click', this._clickLikeHandler);
        }

        const goButton = this._this.getElementsByClassName('meet__button_go')[0];
        if (goButton !== undefined) {
            goButton.removeEventListener('click', this._clickGoButtonHandler);
        }

        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        if (editButton !== undefined) {
            editButton.removeEventListener('click', this._clickEditButtonHandler.bind(this));
        }
    }
}
