'use strict';

export function createSettings(config, callback) {
    const settings = document.createElement('div');
    settings.classList.add('settings');

    config.forEach(obj => {
        const button = document.createElement('button');
        button.classList.add('settings__button', obj.param);
        button.innerHTML = obj.view;
        button.addEventListener('click', () => {
            callback(obj.param);
        });
        settings.appendChild(button);
    });

    return settings;
}