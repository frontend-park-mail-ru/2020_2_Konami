'use strict';

export function createNavigation(application) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <nav class="navigation">
        <a href="/forme" data-section="forMe" class="navigation__choose-link">Для меня</a>
        <a href="/meetings" data-section="meetings" class="navigation__choose-link">Мероприятия</a>
        <a href="/people" data-section="people" class="navigation__choose-link">Люди</a>
    </nav>`;
    console.log(wrapper.firstChild);

    application.appendChild(wrapper.firstElementChild);
}
