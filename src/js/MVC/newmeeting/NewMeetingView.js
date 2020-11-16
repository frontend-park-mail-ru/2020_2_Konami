'use strict';

import  BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {createNewMeetingForm} from "@/js/utils/meetings/NewMeetFormCreate.js";
import {inputFileChangedEventListener} from "@/components/auth/FileUploader/FileUploader.js";
import {saveSelectedTags} from "@/components/auth/SelectedTag/SelectedTag.js";
import {deleteIf} from "@/js/utils/validators/emptyFields.js";
import {closeTagsModalDialog} from "@/components/auth/SelectedTag/SelectedTag.js";
import {addTagsModalDialogEventListener} from "@/components/auth/SelectedTag/SelectedTag.js";
import {displayNotification} from "@/components/auth/Notification/Notification.js";
import {newDate} from "@/components/auth/Date-Time/Date-Time.js";

import {
    OPEN_LOGIN_MODAL, REDIRECT,
    CLOSE_TAGS_MODAL,
    USER_NOT_AUTHORIZED,
    SUBMIT_CREATE_MEET,
    CREATE_MEETING_SUCCESS,
    INVALID_DATE_INPUT,
    INVALID_TIME_INPUT,
    INVALID_START_BIGGER_END,
    BIG_FILE_SIZE,
    APPLY_TAGS_MODAL
} from "@/js/services/EventBus/EventTypes.js";

export default class NewMeetingView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this.needSetGeoposition = true;

        this._initEventHandlers();
    }

    _initEventHandlers() {
        this._eventHandlers = {

            onNotAuthorized: () => {
                EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
            },

            onInvalidDate: (data) => {
                const {prefix} = data;
                const day = document.getElementsByName(`${prefix}-day`)[0];
                const month = document.getElementsByName(`${prefix}-month`)[0];
                const year = document.getElementsByName(`${prefix}-year`)[0];
                this._showInvalidInputs(day, month, year);
            },

            onInvalidTime: (data) => {
                const {prefix} = data;
                const h = document.getElementsByName(`${prefix}-hours`)[0];
                const m = document.getElementsByName(`${prefix}-minutes`)[0];
                this._showInvalidInputs(h, m);
            },

            onInvalidFile: () => {
                displayNotification('Файл превышает максимальный размер');
            },

            onStartBiggerEnd: () => {
                displayNotification('Дата начала мероприятия не может превышать дату окончания');
                ['start', 'end'].forEach((prefix) => {
                    let day = document.getElementsByName(`${prefix}-day`)[0];
                    let month = document.getElementsByName(`${prefix}-month`)[0];
                    let year = document.getElementsByName(`${prefix}-year`)[0];
                    this._showInvalidInputs(day, month, year);
                });
            },

            onSelectTags: () => {
                saveSelectedTags();
            },

            onSubmitForm: (fields) => {
                this.model.createMeeting(fields);
            },

            onCreateSuccess: () => {
                EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
                displayNotification('Вы успешно создали мероприятие');
            }

        }
    }

    render() {
        const form = createNewMeetingForm();
        this.parent.appendChild(form);

        this._initDefaultDateTimeInputValues();
        if (this.needSetGeoposition) {
            this._setUserGeolocation();
        }
        this._addEventListeners();
    }

    erase() {
        const form = document.forms[0];
        if (form !== undefined) {
            this.parent.removeChild(form);
        }

        window.removeEventListener('click', closeTagsModalDialog);
    }

    registerEvents() {
        EventBus.onEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.onEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.onEvent(APPLY_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.onEvent(SUBMIT_CREATE_MEET, this._eventHandlers.onSubmitForm);
        EventBus.onEvent(CREATE_MEETING_SUCCESS, this._eventHandlers.onCreateSuccess);
        EventBus.onEvent(INVALID_DATE_INPUT, this._eventHandlers.onInvalidDate);
        EventBus.onEvent(INVALID_TIME_INPUT, this._eventHandlers.onInvalidTime);
        EventBus.onEvent(BIG_FILE_SIZE, this._eventHandlers.onInvalidFile);
        EventBus.onEvent(INVALID_START_BIGGER_END, this._eventHandlers.onStartBiggerEnd);


    }

    unRegisterEvents() {
        EventBus.offEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.offEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.offEvent(APPLY_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.offEvent(SUBMIT_CREATE_MEET, this._eventHandlers.onSubmitForm);
        EventBus.offEvent(CREATE_MEETING_SUCCESS, this._eventHandlers.onCreateSuccess);
        EventBus.offEvent(INVALID_DATE_INPUT, this._eventHandlers.onInvalidDate);
        EventBus.offEvent(INVALID_TIME_INPUT, this._eventHandlers.onInvalidTime);
        EventBus.offEvent(BIG_FILE_SIZE, this._eventHandlers.onInvalidFile)
        EventBus.offEvent(INVALID_START_BIGGER_END, this._eventHandlers.onStartBiggerEnd);


    }

    _addEventListeners() {
        this._addSubmitFormEventListener();

        inputFileChangedEventListener();
        addTagsModalDialogEventListener();
        window.addEventListener('click', closeTagsModalDialog);
    }

    _addSubmitFormEventListener() {
        const form = document.forms[0];

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const fieldMap = new Map();

            fieldMap.set('name', document.getElementsByName('name')[0].value);
            fieldMap.set('meet-description', document.getElementsByName('meet-description')[0].value);
            fieldMap.set('city', document.getElementsByName('city')[0].value);
            fieldMap.set('address', document.getElementsByName('address')[0].value);

            const selectedTags = Array.from(document.getElementsByClassName('selectedTag'));
            fieldMap.set('meetingTags', selectedTags.map((tag) => {
                return tag.textContent;
            }));

            let dayValue = document.getElementsByName('start-day')[0].value;
            let monthValue = document.getElementsByName('start-month')[0].value;
            let yearValue = document.getElementsByName('start-year')[0].value;

            let hoursValue = document.getElementsByName('start-hours')[0].value;
            let minutesValue = document.getElementsByName('start-minutes')[0].value;
            if (yearValue.length && monthValue.length && dayValue.length) {
                if (!this.model.validator.isValidDate(dayValue, monthValue, yearValue)) {
                    EventBus.dispatchEvent(INVALID_DATE_INPUT, {prefix: 'start'});
                    return;
                }
                if (!this.model.validator.isValidTime(hoursValue, minutesValue)) {
                    EventBus.dispatchEvent(INVALID_TIME_INPUT, {prefix: 'start'});
                    return;
                }

                const start = newDate(yearValue, monthValue, dayValue, hoursValue, minutesValue);

                // fieldMap.set('start', `${yearValue} - ${monthValue} - ${dayValue} - ${hoursValue} - ${minutesValue}`);
                fieldMap.set('start', start.toISOString());
            }

            dayValue = document.getElementsByName('end-day')[0].value;
            monthValue = document.getElementsByName('end-month')[0].value;
            yearValue = document.getElementsByName('end-year')[0].value;
            hoursValue = document.getElementsByName('end-hours')[0].value;
            minutesValue = document.getElementsByName('end-minutes')[0].value;

            if (yearValue.length && monthValue.length && dayValue.length) {
                if (!this.model.validator.isValidDate(dayValue, monthValue, yearValue)) {
                    EventBus.dispatchEvent(INVALID_DATE_INPUT, {prefix: 'end'});
                    return;
                }
                if (!this.model.validator.isValidTime(hoursValue, minutesValue)) {
                    EventBus.dispatchEvent(INVALID_TIME_INPUT, {prefix: 'end'});
                    return;
                }

                const end = newDate(yearValue, monthValue, dayValue, hoursValue, minutesValue);
                // fieldMap.set('end', `${yearValue} - ${monthValue} - ${dayValue} - ${hoursValue} - ${minutesValue}`);
                fieldMap.set('end', end.toISOString());
            }


            const photos = document.getElementById('photoFileUploader').files;
            if (photos.length > 0) {
                let reader = new FileReader();
                reader.readAsDataURL(photos[0]);

                reader.onload = function() {
                    const r = reader.result;
                    fieldMap.set('photo', r);
                    const bodyFields = Object.fromEntries(deleteIf(fieldMap, (k, v) => v.length === 0).entries());
                    EventBus.dispatchEvent(SUBMIT_CREATE_MEET, bodyFields);
                };

                // formData.append(photos[0].name, photos[0]);
            } else {
                const bodyFields = Object.fromEntries(deleteIf(fieldMap, (k, v) => v.length === 0).entries());
                EventBus.dispatchEvent(SUBMIT_CREATE_MEET, bodyFields);
            }
            // formData.append('tags', JSON.stringify(selectedTags));

        });
    }

    _initDefaultDateTimeInputValues() {
        const arr =
            [['day', Date.prototype.getDate],
                ['month', Date.prototype.getMonth],
                ['year', Date.prototype.getFullYear],
                ['hours', Date.prototype.getHours],
                ['minutes', Date.prototype.getMinutes]];

        const startDate = new Date();
        arr.forEach((tok) => {
            let input = document.getElementsByName(`start-${tok[0]}`)[0];
            let val = tok[0] === 'month' ? tok[1].call(startDate) + 1 : tok[1].call(startDate);
            input.value = val;
        });

        const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // plus 3 hours;
        arr.forEach((tok) => {
            let input = document.getElementsByName(`end-${tok[0]}`)[0];
            let val = tok[0] === 'month' ? tok[1].call(endDate) + 1 : tok[1].call(endDate);
            input.value = val;
        });
    }

    _setUserGeolocation() {
        let input;

        if (this.model._user.userCity === null || this.model._user.userAddress === null) {
            this.model._user.getUserGeolocation();

            setTimeout(() => {
                input = document.getElementsByName('city')[0];
                input.value = this.model._user.userCity;

                input = document.getElementsByName('address')[0];
                input.value = this.model._user.userAddress;
                }, 3000);
        }

        input = document.getElementsByName('city')[0];
        input.value = this.model._user.userCity;

        input = document.getElementsByName('address')[0];
        input.value = this.model._user.userAddress;
    }

    _showInvalidInputs() {
        const inputs = [...arguments];
        inputs.forEach((input) => {
            input.classList.add('invalid');
            setTimeout(() => {
                input.classList.toggle('invalid');
            }, 4000);
        })
    }

}

