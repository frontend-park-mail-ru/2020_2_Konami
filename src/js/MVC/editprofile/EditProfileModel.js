'use strict';

import UserModel from "../../models/UserModel.js";
import {createSelectedTag} from "../../../components/auth/SelectedTag/SelectedTag.js";
import {isEmpty} from "../../utils/validators/emptyFields.js";


export default class EditProfileModel {

    constructor() {
        this._user = UserModel.user;

        this.allRecomendationTags = [];
        this.selectedRecomendationTags = [];

    }

    finishEdit = (data) => {
        const {inputFields, photoFormData, photos} = data;
        (async () => {
                // TODO (валидация пустых значений в форме)

                if (!isEmpty(inputFields)) {
                    await this._user.edit(inputFields);
                }
                if (photos.length > 0) {
                    await this._user.updatePhoto(photoFormData);
                }
            }
        )()
    }

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

    checkAuth() {
        return this._user.isAuthenticated();
    }

}

