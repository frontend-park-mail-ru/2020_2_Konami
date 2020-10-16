'use strict';

import UserModel from "../../models/UserModel.js";
import EventBus from "../../services/EventBus/EventBus.js";
import {createSelectedTag} from "../../../components/auth/SelectedTag/SelectedTag.js";
import {
    EDIT_SUCCESS,
    INVALID_LOGIN,
    REDIRECT,
    SELECT_TAGS,
    SUBMIT_EDIT
} from "../../services/EventBus/EventTypes.js";


export default class EditProfileModel {

    constructor() {
        this._user = UserModel.user;

        this.allRecomendationTags = [];
        this.selectedRecomendationTags = [];

        // EventBus.onEvent(SELECT_TAGS, this.saveSelectedTags);


        // EventBus.onEvent(SUBMIT_EDIT, (data) => {
        //     const {inputFields, photo} = data;
        //     (async () => {
        //             await this._user.edit(inputFields);
        //             await this._user.updatePhoto(photo);
        //         }
        //     )()
        // });
    }

    finishEdit = (data) => {
        const {inputFields, photo} = data;
        (async () => {
                await this._user.edit(inputFields);
                await this._user.updatePhoto(photo);
            }
        )()
    }

    // onEditSuccess = () => {
    //     if (!(this._user.isAuthenticated)) {
    //         EventBus.dispatchEvent(INVALID_LOGIN, {});
    //     }
    //     EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
    // }

    saveSelectedTags = () => {
        const tags = Array.from(document.getElementsByClassName('btnLike'));
        this.selectedRecomendationTags = []
        tags.forEach((tag) => {
            if (tag.checked) {
                this.selectedRecomendationTags.push(tag.value);
            }
        });

        const selectedTagsBlock = document.getElementsByClassName('selectedTagsWrapper')[0];
        selectedTagsBlock.innerHTML = '';

        const selectedTags =  this.selectedRecomendationTags.map((tagValue) => createSelectedTag(tagValue));
        selectedTagsBlock.append(...selectedTags);
    }

    get isAuthenticated() {
        return this._user.isAuthenticated;
    }

}

