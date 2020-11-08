'use strict';

import { createMeetPage } from "@/components/meet/meet.js";
import BaseView from "@/js/basics/BaseView/BaseView.js";
import { postMeet } from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import { OPEN_LOGIN_MODAL } from "@/js/services/EventBus/EventTypes.js";

export default class MeetView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
    }

    render(data) {
        this._this = createMeetPage(data);
        this.parent.appendChild(this._this);

        const likeIcon = this._this.getElementsByClassName('meet__like-icon')[0];
        const goButton = this._this.getElementsByClassName('meet__button_go')[0];
        const editButton = this._this.getElementsByClassName('meet__button_edit')[0];
        // тут нужно что то сделать с editbutton 
        this.model.checkAuth().then(isAuth => {
            // снизу ж*па
            if (isAuth) {
                if (likeIcon !== undefined) {
                    likeIcon.addEventListener('click', () => {
                        let isLiked = false;
                        if (likeIcon.firstChild.src.includes('heart')) {
                            likeIcon.firstChild.src = '/assets/like.svg';
                            isLiked = true;
                        } else {
                            likeIcon.firstChild.src = '/assets/heart.svg';
                            isLiked = false;
                        }
                        postMeet({
                            meetId: data.id,
                            fields: {
                                isLiked,
                            },
                        }).then(obj => {
                            if (obj.statusCode === 200) {
                                // OK
                            } else {
                                alert('Permission denied');
                            }
                        });
                    }); 
                }
                if (goButton !== undefined) { 
                    goButton.addEventListener('click', ()=> {
                        let isRegistered = false;
                        if (goButton.innerHTML === 'Пойти') {
                            goButton.innerHTML = 'Отменить поход';
                            isRegistered = true;
                        } else {
                            goButton.innerHTML = 'Пойти';
                            isRegistered = false;
                        }
                        postMeet({
                            meetId: data.id,
                            fields: {
                                isRegistered,
                            },
                        }).then(obj => {
                            if (obj.statusCode === 200) {
                                // OK
                            } else {
                                alert('Permission denied');
                            }
                        });
                    });
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
            }
        });

    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}
