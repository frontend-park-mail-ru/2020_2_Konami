'use strict';

import "@/css/main.scss";

import UserModel from "./models/UserModel.js";
import {registerAuthModalWindows} from "./utils/auth-modal/authModalUtils.js";
import HeaderController from "./MVC/header/headerController.js";
import Router from "./services/Router/Router.js";
import MeetingsController from "./MVC/meetings/MeetingsController.js";
import EventBus from "./services/EventBus/EventBus.js";
import EditProfileController from "./MVC/editprofile/EditProfileController.js";
import ProfileController from "./MVC/profile/ProfileController.js";
import PeopleController from "./MVC/people/PeopleController.js";
import NewMeetingController from "./MVC/newmeeting/NewMeetingController.js";
import EditMeetingController from "./MVC/edit-meeting/EditMeetingController.js";
import MeetController from "./MVC/meet/MeetController.js";
import {
    REDIRECT
} from "./services/EventBus/EventTypes.js";
import SearchController from "@/js/MVC/search-widget/SearchController";

// if (navigator.serviceWorker) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js').then((registration) => {
//             console.log('Service worker is supported! Enjoy! Scope:', registration.scope);
//         })
//             .catch((err) => {
//                 console.log('Na ja! Das ist nicht arbeiten! No SW!', err);
//             });
//     });
// }

(() => {
    const application = document.getElementById('app');

    const user = UserModel.user;
    user.getUserGeolocation();
    if (window.screen.width > 900) {
        user._isMobile = false;
    }

    const headerController = new HeaderController(application);
    headerController.activate();

    registerAuthModalWindows(application);

    Router.register('/', new MeetingsController(application));
    Router.register('/people', new PeopleController(application));
    Router.register('/meetings', new MeetingsController(application));
    Router.register('/editprofile', new EditProfileController(application));
    Router.register('/profile', new ProfileController(application));
    Router.register('/new-meeting', new NewMeetingController(application));
    Router.register('/edit-meeting', new EditMeetingController(application));
    Router.register('/meeting', new MeetController(application));
    Router.register('/search', new SearchController(application));


    Router.route();

    EventBus.onEvent(REDIRECT, (obj) => {
        const {url, state} = obj;
        Router.pushState(url);
    })
})()
