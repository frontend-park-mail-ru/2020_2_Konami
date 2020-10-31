'use strict';

import UserModel from "../../models/UserModel.js";
import {isEmpty} from "../../utils/validators/emptyFields.js";
import Validator from "../../services/Validator/Validator.js";


export default class EditProfileModel {

    constructor() {
        this._user = UserModel.user;
        this.validator = new Validator();

        this.allRecomendationTags = [];
        this.selectedRecomendationTags = [];

    }

    finishEdit(data) {
        const {inputFields, photoFormData, photos} = data;
        (async () => {
                if (!isEmpty(inputFields)) {
                    await this._user.edit(inputFields);
                }
                if (photos.length > 0) {
                    await this._user.updatePhoto(photoFormData);
                }
            }
        )()
    }

    checkAuth() {
        return this._user.isAuthenticated();
    }

}
