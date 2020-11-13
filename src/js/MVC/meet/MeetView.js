'use strict';

import { createMeetPage } from "@/components/meet/meet.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { patchMeeting } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import {
    OPEN_LOGIN_MODAL,
    REDIRECT,
    PASS_MEET_DATA_TO_EDIT
} from "@/js/services/EventBus/EventTypes.js";

export default class MeetView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
        this._data = null;
    }

    render(data) {
        this._data = data;

        this._this = createMeetPage(data, true);
        this.parent.appendChild(this._this);

        const likeIcon = this._this.getElementsByClassName('meet__like-icon')[0] || this._this.getElementsByClassName('meet-mobile__like-icon-wrapper')[0];
        const goButton = this._this.getElementsByClassName('meet__button_go')[0] || this._this.getElementsByClassName('meet-mobile__go-button')[0];
        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        // тут нужно что то сделать с editbutton
        this.model.checkAuth().then(isAuth => {

            if (isAuth) {
                if (likeIcon !== undefined) {
                    likeIcon.addEventListener('click', (evt) => {
                        this._clickLikeHandler(evt, likeIcon);
                    });
                }
                if (goButton !== undefined) {
                    goButton.addEventListener('click', (evt) => {
                        this._clickGoButtonHandler(evt, goButton);
                    });
                }
                if (editButton !== undefined) {
                    editButton.addEventListener('click', this._clickEditButtonHandler.bind(this));
                }
            } else {
                if (likeIcon !== undefined) {
                    likeIcon.addEventListener('click', () => {
                        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    });
                }
                if (goButton !== undefined) {
                    goButton.addEventListener('click', () => {
                        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    });
                }
                if (editButton !== undefined) {
                    editButton.addEventListener('click', () => {
                        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    });
                }
            }
        });

    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
            this._removeEventListeners();
        }
    }

    _clickLikeHandler(evt, icon) {
        if (this._data.isLiked) {
            this._data.isLiked = false;
        } else {
            this._data.isLiked = true;
        }

        patchMeeting({
            meetId: this._data.card.label.id,
            fields: {
                isLiked: this._data.isLiked ,
            },
        }).then(obj => {
            if (obj.statusCode === 200) {
                if (this._data.isLiked) {
                    displayNotification("Вы оценили мероприятие");
                    icon.firstChild.src = '/assets/like.svg';
                } else {
                    displayNotification("Вы убрали лайк");
                    icon.firstChild.src  = '/assets/heart.svg';
                }   
            } else {
                alert('Permission denied');
            }
        });
    };

    _clickGoButtonHandler(evt, element) {
        if (this._data.isRegistered) {
            this._data.isRegistered = false;
        } else {
            this._data.isRegistered = true;
        }

        patchMeeting({
            meetId: this._data.card.label.id,
            fields: {
                isRegistered: this._data.isRegistered,
            },
        }).then(obj => {
            if (obj.statusCode === 200) {
                if (this._data.isRegistered) {
                    displayNotification("Вы зарегистрировались");
                    element.innerHTML = 'Отменить';
                } else {
                    displayNotification("Вы отменили регистрацию");
                    element.innerHTML = 'Пойти';
                }
            } else if (obj.statusCode === 409) {
                displayNotification("Мероприятие уже закончилось");
            } else {
                alert('Permission denied');
            }
        });
    };

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
