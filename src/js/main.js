'use strict';

import HeaderController from "./MVC/header/headerController.js";
import Router from "./services/Router/Router.js";
import MeetingsController from "./MVC/meetings/MeetingsController.js";
import EventBus from "./services/EventBus/EventBus.js";
import EditProfileController from "./MVC/editprofile/EditProfileController.js";
import ProfileController from "./MVC/profile/ProfileController.js";
import {registerAuthModalWindows} from "./utils/auth-modal/authModalUtils.js";
import PeopleController from "./MVC/people/PeopleController.js";
import NewMeetingController from "./MVC/newmeeting/NewMeetingController.js";
import MeetController from "./MVC/meet/MeetController.js";
import {
    REDIRECT
} from "./services/EventBus/EventTypes.js";

(() => {
    const application = document.getElementById('app');

    const headerController = new HeaderController(application);
    headerController.activate();

    registerAuthModalWindows(application);

    Router.register('/', new MeetingsController(application));
    Router.register('/people', new PeopleController(application));
    Router.register('/meetings', new MeetingsController(application));
    Router.register('/editprofile', new EditProfileController(application));
    Router.register('/profile', new ProfileController(application));
    Router.register('/new-meeting', new NewMeetingController(application));
    Router.register('/meet', new MeetController(application));

    Router.route();

    EventBus.onEvent(REDIRECT, (obj) => {
        const {url, state} = obj;
        Router.pushState(url);
    })
})()
