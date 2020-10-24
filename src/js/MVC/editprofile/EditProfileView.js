'use strict';

import BaseView from "../../basics/BaseView/BaseView.js";
import {validateSignupInputForm} from "../../utils/validators/formValidators.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {createSignupEditProfileForm} from "../../utils/auth/onSignupRedirectEditProfileFormCreation.js";
import {deleteIf} from "../../utils/validators/emptyFields.js";

import {
    REDIRECT,
    SUBMIT_EDIT,
    SELECT_TAGS,
    EDIT_SUCCESS,
    USER_NOT_AUTHORIZED,
    OPEN_LOGIN_MODAL
} from "../../services/EventBus/EventTypes.js";

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
                EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
            },

            onSelectTags: () => {
                this.model.saveSelectedTags();
            },

            onSubmitEditForm: (data) => {
                this.model.finishEdit(data);
            }

        }
    }

    render() {
        const form = createSignupEditProfileForm();
        this.parent.appendChild(form);

        this._showTab(this.currentTab);
        this._addEventListeners();
    }

    erase() {
        const form = document.forms[0];
        if (form !== undefined) {
            this.parent.removeChild(form);
        }

        window.removeEventListener('click', this._closeSelectionTagsModal);
    }

    registerEvents() {
        EventBus.onEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.onEvent(EDIT_SUCCESS, this._eventHandlers.onEditSuccess);
        EventBus.onEvent(SELECT_TAGS, this._eventHandlers.onSelectTags);
        EventBus.onEvent(SUBMIT_EDIT, this._eventHandlers.onSubmitEditForm);

    }

    unRegisterEvents() {
        EventBus.offEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.offEvent(EDIT_SUCCESS, this._eventHandlers.onEditSuccess);
        EventBus.offEvent(SELECT_TAGS, this._eventHandlers.onSelectTags);
        EventBus.offEvent(SUBMIT_EDIT, this._eventHandlers.onSubmitEditForm);

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
        if (n === 1 && !validateSignupInputForm(this.currentTab)) {
            return false;
        }
        x[this.currentTab].style.display = "none";
        this.currentTab = this.currentTab + n;
        if (this.currentTab >= x.length) {
            const submBtn = document.getElementById('nextBtn');
            submBtn.type = 'submit';
            submBtn.click();
            this.currentTab = 0;
            EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
        }
        this._showTab(this.currentTab);
    }
    _addEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        nextBtn.onclick = () => this._nextPrev(1);
        prevBtn.onclick = () => this._nextPrev(-1);

        this._addInputFileChangeEventListeners();
        this._addSubmitFormEventListener();
        this._addTagsModalDialogEventListener();
    }

    _addInputFileChangeEventListeners() {
        const inputs = document.querySelectorAll( '.inputfile' );
        Array.prototype.forEach.call( inputs, function( input ) {
            let label	 = input.nextElementSibling,
                labelVal = label.innerHTML;

            input.addEventListener( 'change', function( e )
            {
                let fileName = '';
                if( this.files && this.files.length > 1 )
                    fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
                else
                    fileName = e.target.value.split( '\\' ).pop();

                if( fileName )
                    label.querySelector( 'span' ).innerHTML = fileName;
                else
                    label.innerHTML = labelVal;
            });
        });
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
                fieldMap.set('birthday', `${yearValue} - ${monthValue} - ${dayValue}`);
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

    _addTagsModalDialogEventListener() {
        let btn = document.getElementById("openModalBtn");
        const modal = document.getElementById('modalTags');

        btn.onclick = function() {
            modal.style.display = "block";
        }
        window.addEventListener('click', this._closeSelectionTagsModal);
    }

    _closeSelectionTagsModal = (evt) => {
        const closeBtn = document.getElementsByClassName("close")[0];
        const modal = document.getElementById('modalTags');

        if (evt.target === modal || evt.target === closeBtn) {
            modal.style.display = "none";
            EventBus.dispatchEvent(SELECT_TAGS);
        }
    }
}
