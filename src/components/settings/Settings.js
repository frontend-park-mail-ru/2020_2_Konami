'use strict';

export function createSettings() {
    const settings = document.createElement('div');
    settings.classList.add('settings');

    return settings;
}

export function createButton(view) {
    const button = document.createElement('button');
    button.classList.add('settings__button');
    button.innerHTML = view;

    return button;
}