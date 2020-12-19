'use strict';

import {
    createProfile
} from "@/components/profile/CreateProfile.js";
import {createTagsModal} from "@/components/auth/TagsModal/TagsModal.js";
import {displayNotification} from "@/components/auth/Notification/Notification";
import {getSelectedTags} from "@/components/auth/TagsModal/TagsModal";
import {closeTagsModalDialog} from "@/components/auth/SelectedTag/SelectedTag.js";
import {createDomTag} from "@/js/config/tags.js";

import { postSubscribeUser } from "@/js/services/API/api.js";

import BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {
    APPLY_TAGS_MODAL,
    CLOSE_TAGS_MODAL,
    EDIT_SUCCESS
} from "@/js/services/EventBus/EventTypes.js";
import { createEmptyBlock } from "../../../components/main/EmptyBlock/EmptyBlock";

export default class ProfileView extends BaseView {
    constructor(parent, model) {
        super(parent);

        this.parent = parent;
        this.model = model;
        this._this = null;

        this._initEventHandlers();
    }

    render(data) {
        this._empty = createEmptyBlock();
        this.parent.appendChild(this._empty);
        this.data = data;
        this._this = createProfile(data, this.model.getUserId() === data.card.label.id, this.model.isMobile());
        this.parent.appendChild(this._this);

        const button = document.getElementsByClassName('profile__subscribe-button')[0];
        button.addEventListener('click', this._likeEventListener.bind(this, data));

        if (this.model.getUserId() === data.card.label.id) {
            button.remove();
        }

        this._addEventListeners();
    }

    /**
     * Удаление модального окна со страницы
     */
    erase() {
        if (this._this !== null) {
            this._removeEventListeners();
            this._this.remove();
            this._empty.remove();
        }
    }

    _addEventListeners() {
        const editTagsBtn = document.getElementById('editTagsBtn');
        if (editTagsBtn !== undefined && editTagsBtn !== null) {
            editTagsBtn.addEventListener('click', this._editTagsHandler.bind(this));
            window.addEventListener('click', closeTagsModalDialog);
        }
    }

    _removeEventListeners() {
        const editTagsBtn = document.getElementById('editTagsBtn');
        if (editTagsBtn !== undefined && editTagsBtn !== null) {
            editTagsBtn.addEventListener('click', this._editTagsHandler.bind(this));
            window.addEventListener('click', closeTagsModalDialog);
        }
    }

    _editTagsHandler() {
        this.parent = document.getElementById('app');
        const tagsModalBlock = createTagsModal();
        this.parent.appendChild(tagsModalBlock);
        tagsModalBlock.style.display= 'block';
        const tagsWrapper = document.getElementsByClassName('selectedTagsWrapper')[0];

        const tags = Array.from(document.getElementsByClassName('btnLike'));
        // const userTags = this.data.meetingTags.map((obj) => obj.name);
        const userTags = Array.from(tagsWrapper.getElementsByClassName('btnLike')).map((input) => input.value);
        tags.forEach((tagBtnLikeInput) => {
            if (userTags.includes(tagBtnLikeInput.value)) {
                tagBtnLikeInput.click();
            }
        });

    }

    _initEventHandlers() {
        this._eventHandlers = {
            onApplyTags: () => {
                const fieldMap = new Map();
                fieldMap.set('meetingTags', getSelectedTags());
                this.model.applyTags(Object.fromEntries(fieldMap.entries()));
                displayNotification('Вы успешно применили тэги');
                const tagsModal = document.getElementById('modalTags');
                tagsModal.style.display = 'none';
                this._eventHandlers.onExitApplyingTags();

                const addedTags = fieldMap.get('meetingTags').map((tag) => createDomTag(tag, false));
                const tagsWrapper = document.getElementsByClassName('selectedTagsWrapper')[0];
                tagsWrapper.innerHTML = '';
                tagsWrapper.append(...addedTags);

            },

            onExitApplyingTags: () => {
                const tagsModal = document.getElementById('modalTags');
                this.parent.removeChild(tagsModal);
            },

            onEditSuccess: () => {

            }
        }
    }

    _likeEventListener(item, event) {
        event.preventDefault();
        event.stopPropagation();
        this.model.checkAuth().then(isAuth => {
            if (!isAuth) {
                EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
                return;
            }

            if (item.card.isSubTarget) {
                item.card.isSubTarget = false;
            } else {
                item.card.isSubTarget = true;
            }

            postSubscribeUser(item.card.label.id, item.card.isSubTarget).then(obj => {
                if (obj.statusCode !== 200) {
                    alert('Permission denied');
                    return;
                }
                if (item.card.isSubTarget) {
                    displayNotification("Вы отменили избрание"); 
                    event.target.innerHTML = 'Избрать';
                } else {
                    displayNotification("Вы избрали пользователя");
                    event.target.innerHTML = 'Отменить избрание';
                }
            });
        });
    }

    registerEvents() {
        EventBus.onEvent(APPLY_TAGS_MODAL, this._eventHandlers.onApplyTags);
        EventBus.onEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onExitApplyingTags);
        EventBus.onEvent(EDIT_SUCCESS, this._eventHandlers.onEditSuccess);
    }

    unRegisterEvents() {
        EventBus.offEvent(APPLY_TAGS_MODAL, this._eventHandlers.onApplyTags);
        EventBus.offEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onExitApplyingTags);
        EventBus.offEvent(EDIT_SUCCESS, this._eventHandlers.onEditSuccess);
    }
}
