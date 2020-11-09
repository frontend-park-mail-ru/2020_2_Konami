'use strict';

import UserModel from "@/js/models/UserModel.js";
import {postMeeting} from "@/js/services/API/api.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import Validator from "@/js/services/Validator/Validator.js";
import {isEmpty} from "@/js/utils/validators/emptyFields.js";
import {
    CREATE_MEETING_SUCCESS
} from "@/js/services/EventBus/EventTypes.js";
import {displayNotification} from "../../../components/auth/Notification/Notification";

export default class NewMeetingModel {

    constructor() {
        this._user = UserModel.user;
        this.validator = new Validator();

    }

    checkAuth() {
        return this._user.isAuthenticated();
    }

    createMeeting(fields) {
        (async () => {
                if (!isEmpty(fields)) {
                    const {statusCode} = await postMeeting(fields);
                    switch (statusCode) {
                        case 201:
                            //TODO ВЫ УСПЕШНО СОЗДАЛИ МЕРОПРИЯТИЕ
                            EventBus.dispatchEvent(CREATE_MEETING_SUCCESS);
                            break;

                        case undefined:
                            displayNotification('Проверьте соединение с интернетом!');
                            break;

                        case 228:
                            displayNotification('Проверьте соединение с интернетом!');
                            break;
                    }
                }
            }
        )()
    }

}
