'use strict';

function createBoldSpan(text) {
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('bold');
    nameSpan.innerHTML = text;

    return nameSpan;
}