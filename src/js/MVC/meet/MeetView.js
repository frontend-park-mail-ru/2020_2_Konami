'use strict';

import { createMeetPage } from "../../../components/meet/meetc.js";
import BaseView from "../../basics/BaseView/BaseView.js";
import { postMeet } from "../../services/API/api.js";

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

        const likeIcon = this._this.getElementsByClassName('likeicon')[0];
        likeIcon.addEventListener('click', () => {
            console.log(likeIcon.firstChild.src.includes('heart'))
            let like;
            if (likeIcon.firstChild.src.includes('heart')) {
                likeIcon.firstChild.src = '/assets/like.svg';
                like = true;
            } else {
                likeIcon.firstChild.src = '/assets/heart.svg';
                like = false;
            }
            postMeet({
                meetId: data.id,
                fields: {
                    like,
                },
            }).then(obj => {
                if (obj.statusCode === 200) {
                    // OK
                } else {
                    alert('Permission denied');
                }
            });
        });

        const goButton = this._this.getElementsByClassName('gobutton')[0];
        goButton.addEventListener('click', ()=> {
            let reg;
            if (goButton.innerHTML === 'Пойти') {
                goButton.innerHTML = 'Отменить поход';
                reg = true;
            } else {
                goButton.innerHTML = 'Пойти';
                reg = false;
            }
            postMeet({
                meetId: data.id,
                fields: {
                    reg,
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

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}