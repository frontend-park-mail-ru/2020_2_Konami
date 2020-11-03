'use strict';

export function createEditIcon(imgPath) {
    const element = document.createElement('img');
    element.src = imgPath;
    element.classList.add('icon-with-text__editicon');

    return element;
}