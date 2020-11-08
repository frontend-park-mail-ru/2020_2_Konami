'use strict';

import BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {createEditProfileForm} from "@/js/utils/editprofile/EditProfileFormCreate.js";
import {deleteIf} from "@/js/utils/validators/emptyFields.js";
import {inputFileChangedEventListener} from "@/components/auth/FileUploader/FileUploader.js";
import {
    addTagsModalDialogEventListener,
    closeTagsModalDialog,
    saveSelectedTags
} from "@/components/auth/SelectedTag/SelectedTag.js";
import {displayNotification} from "@/components/auth/Notification/Notification.js";
import {newDate} from "@/components/auth/Date-Time/Date-Time.js";

import {
    REDIRECT,
    SUBMIT_EDIT,
    SELECT_TAGS,
    EDIT_SUCCESS,
    USER_NOT_AUTHORIZED,
    OPEN_LOGIN_MODAL,
    INVALID_DATE_INPUT
} from "@/js/services/EventBus/EventTypes.js";

export default class EditProfileView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this._initEventHandlers();

        this.currentTab = 0;
    }

    _initEventHandlers() {
        this._eventHandlers = {

            onNotAuthorized: () => {
                EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
            },

            onEditSuccess: () => {
                displayNotification('Вы успешно отредактировали профиль')
                EventBus.dispatchEvent(REDIRECT, {url: '/profile'});
            },

            onSelectTags: () => {
                saveSelectedTags();
            },

            onSubmitEditForm: (data) => {
                this.model.finishEdit(data);
            },

            onInvalidDate: () => {
                const day = document.getElementsByName('day')[0];
                const month = document.getElementsByName('month')[0];
                const year = document.getElementsByName('year')[0];
                this._showInvalidInputs(day, month, year);
            },

        }
    }

    render() {
        const form = createEditProfileForm();
        this.parent.appendChild(form);

        this._showTab(this.currentTab);
        this._addEventListeners();
    }

    erase() {
        const form = document.forms[0];
        if (form !== undefined) {
            this.parent.removeChild(form);
        }

        this.currentTab = 0;
        window.removeEventListener('click', closeTagsModalDialog);
    }

    registerEvents() {
        EventBus.onEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.onEvent(EDIT_SUCCESS, this._eventHandlers.onEditSuccess);
        EventBus.onEvent(SELECT_TAGS, this._eventHandlers.onSelectTags);
        EventBus.onEvent(SUBMIT_EDIT, this._eventHandlers.onSubmitEditForm);

        EventBus.onEvent(INVALID_DATE_INPUT, this._eventHandlers.onInvalidDate);
    }

    unRegisterEvents() {
        EventBus.offEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.offEvent(EDIT_SUCCESS, this._eventHandlers.onEditSuccess);
        EventBus.offEvent(SELECT_TAGS, this._eventHandlers.onSelectTags);
        EventBus.offEvent(SUBMIT_EDIT, this._eventHandlers.onSubmitEditForm);

        EventBus.offEvent(INVALID_DATE_INPUT, this._eventHandlers.onInvalidDate);
    }

    _showTab(n) {
        let x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        if (n === 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n === (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Применить";
        } else {
            document.getElementById("nextBtn").innerHTML = "Далее";
        }
    }

    _nextPrev(n) {
        let x = document.getElementsByClassName("tab");
        // if (n === 1 && !validateSignupInputForm(this.currentTab)) {
        //     return false;
        // }
        x[this.currentTab].style.display = "none";
        this.currentTab = this.currentTab + n;
        if (this.currentTab >= x.length) {
            const submBtn = document.getElementById('nextBtn');
            submBtn.type = 'submit';
            submBtn.click();
            this.currentTab--;
        }
        this._showTab(this.currentTab);
    }
    _addEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        nextBtn.onclick = () => this._nextPrev(1);
        prevBtn.onclick = () => this._nextPrev(-1);

        this._addSubmitFormEventListener();

        inputFileChangedEventListener();
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
            fieldMap.set('email', document.getElementsByName('email')[0].value);
            const dayValue = document.getElementsByName('day')[0].value;
            const monthValue = document.getElementsByName('month')[0].value;
            const yearValue = document.getElementsByName('year')[0].value;

            fieldMap.set('city', document.getElementsByName('city')[0].value);

            if (document.getElementById('male').checked) {
                fieldMap.set('gender', 'M');
            } else if (document.getElementById('female').checked) {
                fieldMap.set('gender', 'F');
            }

            const selectedTags = Array.from(document.getElementsByClassName('selectedTag'));
            fieldMap.set('meetingTags', selectedTags.map((tag) => {
                return tag.textContent;
            }));

            if (yearValue.length && monthValue.length && dayValue.length) {
                if (!this.model.validator.isValidDate(dayValue, monthValue, yearValue)) {
                    EventBus.dispatchEvent(INVALID_DATE_INPUT);
                    return;
                }
                const birthDay = newDate(yearValue, monthValue, dayValue, 0, 0);
                const birthDayString = birthDay.toISOString();
                fieldMap.set('birthday', birthDayString.slice(0, birthDayString.indexOf('T')));
            }

            const bodyFields = Object.fromEntries(deleteIf(fieldMap, (k, v) => v.length === 0).entries());

            const photos = document.getElementById('photoFileUploader').files;
            let formData = new FormData();
            if (photos.length > 0) {
                formData.append(photos[0].name, photos[0]);
            }
            EventBus.dispatchEvent(SUBMIT_EDIT, {inputFields: bodyFields, photoFormData: formData, photos: photos});

        });
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
