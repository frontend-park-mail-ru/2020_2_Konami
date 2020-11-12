'use strict';

export function createHeaderMobile() {
    const headerWrapper = document.createElement('div');
    headerWrapper.innerHTML = `
        <header class="header-mobile">
            <img src="assets/google.png" data-section="meetings" class="header-mobile__logo">
            <img src="assets/loupe.svg" class="header-mobile__search">
            <img src="assets/add-meet.svg" id="newMeet" class="header-mobile__new-meet-btn" data-section="newMeeting" style="display: none;">
            <div class="header-mobile__logo-wrapper">
                <img src="assets/logo-new.png" id="profileIcon" class="header-mobile__icon">
            </div>
            <div class="search-block">
                <div class="search-block__search-input-wrapper">
                    <input class="search-block__search-input">
                    <button class="search-block__cancel-button">Отменить</button>
                </div>
                <div class="search-block__offers">
                    <h4 class="search-block__offers-title">
                        Популярно сейчас
                    </h4>
                    <span class="search-block__offer">Шахматы</span>
                    <span class="search-block__offer">Шахматы</span>
                    <span class="search-block__offer">Шахматы</span>
                </div>
            </div>
        </header>
    `;

    const search = headerWrapper.getElementsByClassName('header-mobile__search')[0];
    const modalSearch = headerWrapper.getElementsByClassName('search-block')[0];
    search.addEventListener('click', (evt) => {
        modalSearch.style.display = 'flex';
    });

    const cancel = headerWrapper.getElementsByClassName('search-block__cancel-button')[0];
    cancel.addEventListener('click', () => {
        modalSearch.style.display = 'none';
    });

    return headerWrapper.firstElementChild;
}
