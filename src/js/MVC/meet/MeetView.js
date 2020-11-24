'use strict';

import { createMeetPage } from "@/components/meet/meet.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { patchMeeting } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { createChatPopup, scrollTo } from "@/components/chat/chat.js";
import { createIncomingMsg, createOutgoingMsg } from "@/components/chat/message.js";

import {Ws} from "@/js/services/Ws/ws.js";

import {
    OPEN_LOGIN_MODAL,
    REDIRECT,
    PASS_MEET_DATA_TO_EDIT,
    CHAT_MESSAGE
} from "@/js/services/EventBus/EventTypes.js";

export default class MeetView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
        this._data = null;

        this.wsConn = null;

        this._initEventHandlers();

    }

    _initEventHandlers() {
        this._eventHandlers = {

            onChatMessage: (payload) => {
                console.log(payload);
                const {text, timestamp, meetId, authorId} = payload;
                if (this.model.meetId === meetId) {
                    const messagesHistory = document.getElementsByClassName('msg_history')[0];
                    messagesHistory.appendChild(authorId === this.model.getUserId() ?
                        createOutgoingMsg(text, timestamp) : createIncomingMsg(text, timestamp, authorId));

                    // messagesContainer.textContent += text;
                }
            },
        }
    }

    render(data) {
        this.wsConn = new Ws();

        this._data = data;

        this._this = createMeetPage(data);
        this._this.appendChild(createChatPopup());

        this.parent.appendChild(this._this);
        // this.parent.appendChild(chat);

        const likeIcon = this._this.getElementsByClassName('meet__like-icon')[0];
        const goButton = this._this.getElementsByClassName('meet__button_go')[0];
        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        const openChatBtn = this._this.getElementsByClassName('open-chat-button')[0];


        // тут нужно что то сделать с editbutton
        this.model.checkAuth().then(isAuth => {
            // снизу ж*па
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

                this._addChatListeners();
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
                if (openChatBtn !== undefined) {
                    openChatBtn.addEventListener('click', () => {
                        EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    });
                }
            }

            // this._addChatListeners();
        });

    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
            this._removeEventListeners();
        }
    }

    registerEvents() {
        EventBus.onEvent(CHAT_MESSAGE, this._eventHandlers.onChatMessage);


    }

    unRegisterEvents() {
        EventBus.offEvent(CHAT_MESSAGE, this._eventHandlers.onChatMessage);

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

    _addChatListeners() {
        const openChatBtn = document.getElementsByClassName('open-chat-button')[0];
        const closeChatBtn = document.getElementsByClassName('close-chat-button')[0];
        const sendChatBtn = document.getElementsByClassName('send-chat-button')[0];

        const chevronDownIcon = document.getElementsByClassName('panel-heading__icon')[1];

        const chatPopup = document.getElementById('chatPopup');

        openChatBtn.onclick = () => {
            chevronDownIcon.classList.toggle('revert');

            // CLOSE
            if (chatPopup.style.display === 'block') {
                scrollTo(openChatBtn.getBoundingClientRect().top, () => {
                    chatPopup.style.display = 'none';
                });

            } else

            // OPEN
            if (chatPopup.style.display.length === 0 || chatPopup.style.display === 'none') {
                chatPopup.style.display = 'block';

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }
        }

        sendChatBtn.onclick = () => {
            const msg = document.getElementsByName('message')[0];

            const date = new Date();
            if (msg.value !== '') {
                this.wsConn.send(CHAT_MESSAGE, {
                    text: msg.value,
                    timestamp: date.toISOString(),
                    meetId: this.model.meetId,
                    authorId: this.model.getUserId()
                });
            }

            msg.value = '';
        }

    }
}
