'use strict';

export function createHeaderMobile() {
    const headerWrapper = document.createElement('div');
    headerWrapper.innerHTML = `
        <header class="header-mobile">
            <img src="assets/google.png" data-section="meetings" class="header-mobile__logo">
            <img src="assets/loupe.svg" class="header-mobile__search">
            <img src="assets/add-meet.svg" id="newMeet" class="header-mobile__icon icon square" data-section="newMeeting" style="display: none;">
            <div class="header-mobile__logo-wrapper">
                <img src="assets/logo-new.png" id="profileIcon" class="header-mobile__icon" data-section="profile">
            </div>
        </header>
    `;

    return headerWrapper.firstElementChild;
}