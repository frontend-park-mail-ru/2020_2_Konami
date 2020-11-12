'use strict';

import EventBus from "@/js/services/EventBus/EventBus.js";
import NewMeetingView from "@/js/MVC/newmeeting/NewMeetingView.js";
import {createSelectedTag} from "@/components/auth/SelectedTag/SelectedTag";
import { patchMeeting } from "@/js/services/API/api.js";
import {displayNotification} from "@/components/auth/Notification/Notification.js";

import {
    REDIRECT
} from "@/js/services/EventBus/EventTypes.js";

export default class EditMeetingView extends NewMeetingView {

    constructor(parent, model) {
        super(parent, model);
        this.id = null;
        this.needSetGeoposition = false;

        this._eventHandlers.onSubmitForm = (fields) => {
            // TODO чек если поле не изменилось

            patchMeeting({
                meetId: this.card.label.id,
                fields: fields,
            }).then(obj => {
                if (obj.statusCode === 200) {
                    const url = '/meet?meetId=' + this.id;
                    EventBus.dispatchEvent(REDIRECT, {url: url});
                    displayNotification('Вы успешно отредактировали мероприятие');

                } else {
                    alert('Permission denied');
                }
            });

            console.log(this.id);
        }

        this._eventHandlers.onFillingEditingValues = (data) => {
            const {id, startDate, endDate, text, title, place, tags, imgSrc} = data;
            this.id = id;

            const titleInput = document.getElementsByName('name')[0];
            titleInput.value = title;

            const textInput = document.getElementsByName('meet-description')[0];
            textInput.value = text;

            const meetPoster = document.getElementsByClassName('meeting-poster')[0];
            meetPoster.src = imgSrc;

            const addressInput = document.getElementsByName('address')[0];
            const cityInput = document.getElementsByName('city')[0];
            const tokens = place.split(', ');
            cityInput.value = tokens[0];
            tokens.splice(0, 1);
            addressInput.value = tokens.join(', ');

            const start = new Date(Date.parse(startDate));
            this._fillDateTime('start', start);
            const end = new Date(Date.parse(endDate));
            this._fillDateTime('end', end);

            const selectedTagsBlock = document.getElementsByClassName('selectedTagsWrapper')[0];
            selectedTagsBlock.innerHTML = '';
            const selectedDomTags =  tags.map((tagBtnLikeInput) => createSelectedTag(tagBtnLikeInput));
            selectedTagsBlock.append(...selectedDomTags);

        }

    }

    _fillDateTime(prefix, datetime) {
        const day = document.getElementsByName(`${prefix}-day`)[0];
        const month = document.getElementsByName(`${prefix}-month`)[0];
        const year = document.getElementsByName(`${prefix}-year`)[0];

        const hours = document.getElementsByName(`${prefix}-hours`)[0];
        const minutes = document.getElementsByName(`${prefix}-minutes`)[0];

        day.value = datetime.getDate();
        month.value = datetime.getMonth();
        year.value = datetime.getFullYear();
        hours.value = datetime.getHours();
        minutes.value = datetime.getMinutes();
    }


}
