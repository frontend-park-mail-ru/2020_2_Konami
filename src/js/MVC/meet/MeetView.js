'use strict';

import { createMeetPage } from "@/components/meet/meet.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { patchMeeting, postMessage, getMessages } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { displayNotification } from "@/components/auth/Notification/Notification.js";
import { createMainTitle } from "@/components/main/MainTitle/CreateMainTitle.js"
import CardWrapper from "../../../components/main/CardWrapper/CardWrapperClass.js"
import { createChatPopup, scrollTo } from "@/components/chat/chat.js";
import { createIncomingMsg, createOutgoingMsg } from "@/components/chat/message.js";
import {createListUser} from "@/components/chat/user-list.js";

import {Ws} from "@/js/services/Ws/ws.js";

import {getPeople} from "@/js/services/API/api.js";

import {
    OPEN_LOGIN_MODAL,
    REDIRECT,
    PASS_MEET_DATA_TO_EDIT,
    CHAT_MESSAGE,
    CONNECT_CHAT,
    DISCONNECT_CHAT
} from "@/js/services/EventBus/EventTypes.js";

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
        // TODO fucking stub
        getPeople(1).then(response => {
            if (response.statusCode === 200) {
                Object.values(response.parsedJson).forEach((user) => {
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

                if (parseInt(this.model.meetId, 10) === meetId) {
                    const messagesHistory = document.getElementsByClassName('msg_history')[0];
                    messagesHistory.appendChild(authorId === this.model.getUserId() ?
                        createOutgoingMsg(text, timestamp) : createIncomingMsg(text, timestamp, this.users.get(authorId)));
                    messagesHistory.lastChild.scrollIntoView();
                }

                // TODO it's STUB, to DELETE
                this._appendUserList(authorId);
            },

            onNewChatConnect: (payload) => {
                const {id} = payload;
                if (id === this.model.getUserId()) {
                    return;
                }

                const userList = document.getElementsByClassName('users-container')[0];

                const alreadyExist = document.getElementById('listUser' + id);
                if (!alreadyExist) {
                    userList.appendChild(createListUser(this.users.get(id)));
                    userList.innerHTML += `<hr>`;
                }
            },

            onChatDisconnect: (payload) => {
                const {id} = payload;
                if (id === this.model.getUserId()) return;

                const userList = document.getElementsByClassName('users-container')[0];
                const listUser = document.getElementById('listUser' + id);
                userList.removeChild(listUser.nextElementSibling);  // delete <hr>
                userList.removeChild(listUser);
            }

        }
    }

    render(data, simulars) {
        // this.wsConn = new Ws(); // TODO сделать кнопку поверх чата CONNECT
        // // EventBus.dispatchEvent(CONNECT_CHAT, this.model.getUserId());
        // this.wsConn.ws.onopen = () => {
        //     this.wsConn.send(CONNECT_CHAT, {
        //         id: this.model.getUserId()
        //     });
        // }

        const isMobile = this.model.isMobile();

        if (isMobile) {
            this._renderMobile(data, simulars);
        } else {
            this._renderDesktop(data, simulars);
        }

        this._this.appendChild(createChatPopup(data.card.label.title, isMobile));
        const messagesHistory = document.getElementsByClassName('msg_history')[0];
        getMessages(this.model.meetId).then(response => {
            if (response.statusCode === 200) {

                Object.values(response.parsedJson).forEach((msg) => {
                    // this.users.set(user.label.id, user.label);
                    messagesHistory.appendChild(msg.authorId === this.model.getUserId() ?
                        createOutgoingMsg(msg.text, msg.timestamp) :
                        createIncomingMsg(msg.text, msg.timestamp, this.users.get(msg.authorId)));
                });
                // messagesHistory.lastChild.scrollIntoView();
            }
        });


        const likeIcon = this._this.getElementsByClassName('meet__like-icon-wrapper')[0] ||
                         this._this.getElementsByClassName('meet-mobile__like-icon-wrapper')[0];
        const goButton = this._this.getElementsByClassName('meet__button_go')[0];
        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        // const openChatBtn = this._this.getElementsByClassName('open-chat-button')[0];
        const members = document.getElementsByClassName('meet__members-wrapper')[0] ||
                            document.getElementsByClassName('meet-mobile__members-wrapper')[0];


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
        if (members !== undefined) {
            this._createMembers(members, data.registrations);
        }

        let myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        });

        ymaps.geocode(`${data.card.city}, ${data.card.address}`, {
            /**
             * Опции запроса
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
             */
            // Сортировка результатов от центра окна карты.
            // boundedBy: myMap.getBounds(),
            // strictBounds: true,
            // Вместе с опцией boundedBy будет искать строго внутри области, указанной в boundedBy.
            // Если нужен только один результат, экономим трафик пользователей.
            results: 1
        }).then(function (res) {
                // Выбираем первый результат геокодирования.
                let firstGeoObject = res.geoObjects.get(0),
                    // Координаты геообъекта.
                    // coords = firstGeoObject.geometry.getCoordinates(),
                    // Область видимости геообъекта.
                    bounds = firstGeoObject.properties.get('boundedBy');

                firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
                // Получаем строку с адресом и выводим в иконке геообъекта.
                firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

                // Добавляем первый найденный геообъект на карту.
                myMap.geoObjects.add(firstGeoObject);
                // Масштабируем карту на область видимости геообъекта.
                myMap.setBounds(bounds, {
                    // Проверяем наличие тайлов на данном масштабе.
                    checkZoomRange: true
                });

                /**
                 * Все данные в виде javascript-объекта.
                 */
                console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll());
                /**
                 * Метаданные запроса и ответа геокодера.
                 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderResponseMetaData.xml
                 */
                console.log('Метаданные ответа геокодера: ', res.metaData);
                /**
                 * Метаданные геокодера, возвращаемые для найденного объекта.
                 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderMetaData.xml
                 */
                console.log('Метаданные геокодера: ', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData'));
                /**
                 * Точность ответа (precision) возвращается только для домов.
                 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/precision.xml
                 */
                console.log('precision', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.precision'));
                /**
                 * Тип найденного объекта (kind).
                 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/kind.xml
                 */
                console.log('Тип геообъекта: %s', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.kind'));
                console.log('Название объекта: %s', firstGeoObject.properties.get('name'));
                console.log('Описание объекта: %s', firstGeoObject.properties.get('description'));
                console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'));
                /**
                * Прямые методы для работы с результатами геокодирования.
                * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeocodeResult-docpage/#getAddressLine
                */
                console.log('\nГосударство: %s', firstGeoObject.getCountry());
                console.log('Населенный пункт: %s', firstGeoObject.getLocalities().join(', '));
                console.log('Адрес объекта: %s', firstGeoObject.getAddressLine());
                console.log('Наименование здания: %s', firstGeoObject.getPremise() || '-');
                console.log('Номер здания: %s', firstGeoObject.getPremiseNumber() || '-');

                /**
                 * Если нужно добавить по найденным геокодером координатам метку со своими стилями и контентом балуна, создаем новую метку по координатам найденной и добавляем ее на карту вместо найденной.
                 */
                /**
                 var myPlacemark = new ymaps.Placemark(coords, {
                 iconContent: 'моя метка',
                balloonContent: 'Содержимое балуна <strong>моей метки</strong>'
                }, {
                preset: 'islands#violetStretchyIcon'
                });

                myMap.geoObjects.add(myPlacemark);
                */
            });

        this._addChatListeners(isMobile);

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

    _createMembers(members, registrations) {
        registrations.forEach(item => {
            const member = document.createElement('div');
            member.classList.add('meet__member');

            const memberImg = document.createElement('img');
            memberImg.classList.add('meet__member-avatar');
            memberImg.src = item.imgSrc;

            const memberName = document.createElement('h3');
            memberName.classList.add('meet__member-name');
            memberName.innerHTML = item.name;

            member.append(memberImg, memberName);

            member.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/profile?userId=${item.id}`});
            });

            members.appendChild(member);
        });
    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
            this._removeEventListeners();

            const userId = this.model.getUserId();
            if (userId !== null) {
                if (this.wsConn === null) {
                    return;
                }
                this.wsConn.send(DISCONNECT_CHAT, {
                    id: this.model.getUserId()
                });
            }
        }
    }

    registerEvents() {
        EventBus.onEvent(CHAT_MESSAGE, this._eventHandlers.onChatMessage);
        EventBus.onEvent(CONNECT_CHAT, this._eventHandlers.onNewChatConnect);
        EventBus.onEvent(DISCONNECT_CHAT, this._eventHandlers.onChatDisconnect);


    }

    unRegisterEvents() {
        EventBus.offEvent(CHAT_MESSAGE, this._eventHandlers.onChatMessage);
        EventBus.offEvent(CONNECT_CHAT, this._eventHandlers.onNewChatConnect);
        EventBus.offEvent(DISCONNECT_CHAT, this._eventHandlers.onChatDisconnect);
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

    _clickEditButtonHandler() {
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

    _addChatListeners(isMobile) {
        this._appendUserList(this.model.getUserId());

        const panelHead = document.getElementsByClassName('panel-heading')[0];
        const openChatBtn = document.getElementsByClassName('open-chat-button')[0];
        // const closeChatBtn = document.getElementsByClassName('close-chat-button')[0];
        const sendChatBtn = document.getElementsByClassName('send-chat-button')[0];

        const chevronDownIcon = document.getElementsByClassName('panel-heading__icon')[1];

        const chatPopup = document.getElementById('chatPopup');
        const messagesHistory = document.getElementsByClassName('msg_history')[0];
        const chatTitle = document.getElementsByClassName('chat-title')[0];

        const chatPanelOnMouseHandler = () => {
            rightButton.style.display = 'inline-block';
            chatTitle.style.display = 'inline-block';
        }

        const chatPanelOnMouseLeaveHandler = () => {
            rightButton.style.display = 'none';
            chatTitle.style.display = 'none';
        }

        chatTitle.style.display = 'none';

        openChatBtn.onclick = () => {
            this.model.checkAuth().then(isAuth => {
                if (!isAuth) {
                    EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                    return;
                }

                if (this.wsConn === null) {
                    this.wsConn = new Ws(this.model.getUserId()); // TODO сделать кнопку поверх чата CONNECT
                }

                chevronDownIcon.classList.toggle('revert');

                // CLOSE
                if (chatPopup.style.display === 'flex') {
                    panelHead.addEventListener('mouseenter', chatPanelOnMouseHandler);
                    panelHead.addEventListener('mouseleave', chatPanelOnMouseLeaveHandler);

                    if (!isMobile) {
                        panelHead.classList.toggle('mixin');
                    }
                    panelHead.classList.toggle('border-top-raduis');
                    scrollTo(0, () => {
                        chatPopup.style.display = 'none';
                    });

                } else

                    // OPEN
                if (chatPopup.style.display.length === 0 || chatPopup.style.display === 'none') {
                    panelHead.removeEventListener('mouseenter', chatPanelOnMouseHandler);
                    panelHead.removeEventListener('mouseleave', chatPanelOnMouseLeaveHandler);

                    if (!isMobile) {
                        panelHead.classList.toggle('mixin');
                    }
                    panelHead.classList.toggle('border-top-raduis');
                    chatPopup.style.display = 'flex';
                    chatTitle.style.display = 'inline-block';
                    messagesHistory.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth"
                    });

                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth"
                    });
                    // scrollTo(document.body.scrollHeight, () => {
                    //     messagesHistory.lastChild.scrollIntoView();
                    // });
                }

            });
        }
        const msg = document.getElementsByName('message')[0];

        sendChatBtn.onclick = () => {

            const date = new Date();
            if (msg.value !== '') {
                postMessage({
                   meetId: parseInt(this.model.meetId, 10),
                   text: msg.value,
                   timestamp: date.toISOString(),
                });
                // const messagesHistory = document.getElementsByClassName('msg_history')[0];
                // messagesHistory.appendChild(createOutgoingMsg(msg.value, date.toISOString()));

                // this.wsConn.send(CHAT_MESSAGE, {
                //     text: msg.value,
                //     timestamp: date.toISOString(),
                //     meetId: parseInt(this.model.meetId, 10),
                //     authorId: this.model.getUserId()
                // });
            }

            msg.value = '';
        }

        msg.addEventListener('keyup', ({key}) => {
            if (key === "Enter")  {
                sendChatBtn.click()
            }
        });

        const rightButton = document.getElementsByClassName('pull-right')[0];
        if (!isMobile) {
            panelHead.addEventListener('mouseenter', chatPanelOnMouseHandler);
            panelHead.addEventListener('mouseleave', chatPanelOnMouseLeaveHandler);

        } else {
            rightButton.style.display = 'inline-block';
            chatTitle.style.display = 'inline-block';
        }

    }

    _appendUserList(userId) {
        // TODO it's STUB, to DELETE
        const userList = document.getElementsByClassName('users-container')[0];

        const alreadyExist = document.getElementById('listUser' + userId);
        if (!alreadyExist) {
            userList.appendChild(createListUser(this.users.get(userId)));
            userList.innerHTML += `<hr>`;
        }
    }
}
