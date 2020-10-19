'use strict';

import HeaderController from "./MVC/header/headerController.js";
import Router from "./services/Router/Router.js";
import MeetingsController from "./MVC/meetings/MeetingsController.js";
import EventBus from "./services/EventBus/EventBus.js";
import EditProfileController from "./MVC/editprofile/EditProfileController.js";
import ProfileController from "./MVC/profile/ProfileController.js";
import {registerAuthModalWindows} from "./utils/auth/authModalUtils.js";
import {
    REDIRECT
} from "./services/EventBus/EventTypes.js";
import PeopleController from "./MVC/people/PeopleController.js";

(() => {
    const application = document.getElementById('app');

    const headerController = new HeaderController(application);
    headerController.activate();

    registerAuthModalWindows(application);

    Router.register('/', new MeetingsController(application));
    Router.register('/peoples', new PeopleController(application));
    Router.register('/meetings', new MeetingsController(application));
    Router.register('/editprofile', new EditProfileController(application));
    Router.register('/profile', new ProfileController(application));

    Router.route();

    EventBus.onEvent(REDIRECT, (obj) => {
        const {url, state} = obj;
        Router.pushState(url);
    })
})()
