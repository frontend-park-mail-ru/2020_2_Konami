'use strict';

export function wrapCreateChipsFunc(parentNode) {
    return  labelText => {
        const label = document.createElement('span');
        label.classList.add('chips');
        label.innerHTML = labelText;

        parentNode.appendChild(label);
    };
}