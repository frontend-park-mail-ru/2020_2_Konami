'use strict';

export function createLink(href) {
    const link = document.createElement('a');
    link.classList.add('link');
    link.innerHTML = href;

    return link;
}