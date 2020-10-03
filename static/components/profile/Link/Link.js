'use strict';

function createLink(href) {
    const link = document.createElement('a');
    link.classList.add('link');
    link.innerHTML = href;

    return link;
}