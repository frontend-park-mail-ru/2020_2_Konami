'use strict';

export function createHeader() {
    const headerWrapper = document.createElement('div');
    headerWrapper.innerHTML = `
        <header class="header">
            <div class="header__top">
                <img src="assets/google.png" data-section="meetings" class="header__logo">
                <input type="search" placeholder="Люди, мероприятия" class="header__search-input">
                <img src="assets/add-meet.svg" id="newMeet" class="header__icon icon square">
                <img src="assets/pericon.svg" id="profileIcon" class="header__icon icon">
            </div>
            <nav class="navigation">
                <a href="/meetings" data-section="meetings" class="navigation__choose-link">Мероприятия</a>
                <a href="/people" data-section="people" class="navigation__choose-link">Люди</a>
            </nav>
        </header>
    `;

    return headerWrapper.firstElementChild
}
