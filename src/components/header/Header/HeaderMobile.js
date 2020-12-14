'use strict';

export function createHeaderMobile(isMobile) {
    let headerClass = null;
    if (isMobile) {
        headerClass = 'header-mobile';
    } else {
        headerClass = 'header-mobile header-mobile_fix';
    }

    const headerWrapper = document.createElement('div');
    headerWrapper.innerHTML = `
        <header class="${headerClass}">
            <img src="assets/newlogo.png" data-section="meetings" class="header-mobile__logo">
            <nav class="header-mobile__navigation">
                <a href="/meetings" data-section="meetings" class="navigation__choose-link navigation__choose-link_blue">Мероприятия</a>
                <a href="/people" data-section="people" class="navigation__choose-link navigation__choose-link_green">Люди</a>
            </nav>
            <img src="assets/loupe.svg" class="header-mobile__search">
            <div class="header-mobile__logo-wrapper">
                <img src="assets/logo-new.png" id="profileIcon" class="header-mobile__icon">
            </div>
            <div class="search-block">
                <div class="search-block__search-input-wrapper">
                    <input class="search-block__search-input">
                    <button class="search-block__cancel-button">Отменить</button>
                </div>
                <div class="search-block__offers">
                </div>
            </div>
        </header>
    `;

    const search = headerWrapper.getElementsByClassName('header-mobile__search')[0];
    const modalSearch = headerWrapper.getElementsByClassName('search-block')[0];
    search.addEventListener('click', () => {
        modalSearch.style.display = 'flex';
    });

    const cancel = headerWrapper.getElementsByClassName('search-block__cancel-button')[0];
    cancel.addEventListener('click', () => {
        modalSearch.style.display = 'none';
    });

    return headerWrapper.firstElementChild;
}
