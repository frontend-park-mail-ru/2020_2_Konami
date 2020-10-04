'use strict';

export function createMetIcon(iconSrc) {
    const icon = document.createElement('img');
    icon.classList.add('meticon');
    icon.src = iconSrc;

    return icon;
}
