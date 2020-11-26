'use strict';

import { createMeetPage } from "@/components/meet/meet.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { patchMeeting } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { createMainTitle } from "@/components/main/MainTitle/CreateMainTitle.js"
import CardWrapper from "../../../components/main/CardWrapper/CardWrapperClass.js"
import { createChatPopup, scrollTo } from "@/components/chat/chat.js";
import { createIncomingMsg, createOutgoingMsg } from "@/components/chat/message.js";

import {Ws} from "@/js/services/Ws/ws.js";

import {getPeople} from "@/js/services/API/api.js";

import {
    OPEN_LOGIN_MODAL,
    REDIRECT,
    PASS_MEET_DATA_TO_EDIT,
    CHAT_MESSAGE
} from "@/js/services/EventBus/EventTypes.js";
import { createEmptyBlock } from "../../../components/main/EmptyBlock/EmptyBlock.js";

export default class MeetView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
        this._data = null;

        this.wsConn = null;
        this.users = new Map();

        this._initEventHandlers();
        this._loadData();

    }

    _loadData() {
        getPeople(1).then(response => {
            if (response.statusCode === 200) {

                const allUsers = Object.values(response.parsedJson).forEach((user) => {
                    this.users.set(user.label.id, user.label);
                });
            }
        });
    }

    _initEventHandlers() {
        this._eventHandlers = {

            onChatMessage: (payload) => {
                console.log(payload);
                const {text, timestamp, meetId, authorId} = payload;

                if (this.model.meetId === meetId) {
                    const messagesHistory = document.getElementsByClassName('msg_history')[0];
                    messagesHistory.appendChild(authorId === this.model.getUserId() ?
                        createOutgoingMsg(text, timestamp) : createIncomingMsg(text, timestamp, this.users.get(authorId)));

                    // messagesContainer.textContent += text;
                }
            },
        }
    }

    render(data, simulars) {
        this.wsConn = new Ws();

        const isMobile = this.model.isMobile();

        if (isMobile) {
            this._renderMobile(data, simulars);
        } else {
            this._renderDesktop(data, simulars);
        }

        this._this.appendChild(createChatPopup(isMobile));

        const likeIcon = this._this.getElementsByClassName('meet__like-icon-wrapper')[0] ||
                         this._this.getElementsByClassName('meet-mobile__like-icon-wrapper')[0];
        const goButton = this._this.getElementsByClassName('meet__button_go')[0];
        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        const openChatBtn = this._this.getElementsByClassName('open-chat-button')[0];


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

        const members = document.getElementsByClassName('meet__members-wrapper')[0] ||
                            document.getElementsByClassName('meet-mobile__members-wrapper')[0];
        
        data.members.forEach(item => {
            const member = document.createElement('div');
            member.classList.add('meet__member');

            const memberImg = document.createElement('img');
            memberImg.classList.add('meet__member-avatar');
            memberImg.src = item.label.imgSrc;

            const memberName = document.createElement('h3');
            memberName.classList.add('meet__member-name');
            memberName.innerHTML = item.label.name;


            member.append(memberImg, memberName);

            member.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.label.id}`});
            });

            members.appendChild(member);
        });



        this._addChatListeners();

    }

    _renderDesktop(data, simulars) {
        this._data = data;
        this._this = createMeetPage(data, false);
        this.parent.appendChild(this._this);

        const cardWrapper = new CardWrapper(true, false);

        this._this.appendChild(cardWrapper.render());

        const author = document.getElementsByClassName('meet__author-wrapper')[0];
        author.addEventListener('click', () => {
            EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${data.card.authorId}`})
        });

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

    registerEvents() {
        EventBus.onEvent(CHAT_MESSAGE, this._eventHandlers.onChatMessage);


    }

    unRegisterEvents() {
        EventBus.offEvent(CHAT_MESSAGE, this._eventHandlers.onChatMessage);

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

    _addChatListeners() {
        const openChatBtn = document.getElementsByClassName('open-chat-button')[0];
        const closeChatBtn = document.getElementsByClassName('close-chat-button')[0];
        const sendChatBtn = document.getElementsByClassName('send-chat-button')[0];

        const chevronDownIcon = document.getElementsByClassName('panel-heading__icon')[1];

        const chatPopup = document.getElementById('chatPopup');

        openChatBtn.onclick = () => {
            chevronDownIcon.classList.toggle('revert');

            // CLOSE
            if (chatPopup.style.display === 'flex') {
                scrollTo(openChatBtn.getBoundingClientRect().top, () => {
                    chatPopup.style.display = 'none';
                });

            } else

            // OPEN
            if (chatPopup.style.display.length === 0 || chatPopup.style.display === 'none') {
                chatPopup.style.display = 'flex';

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }
        }
        const msg = document.getElementsByName('message')[0];

        sendChatBtn.onclick = () => {

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

        msg.addEventListener('keyup', ({key}) => {
            if (key === "Enter")  {
                sendChatBtn.click()
            }
        })

    }
}
