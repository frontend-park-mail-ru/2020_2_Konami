'use strict';

import {applyOptionsTo} from "../utils.js";

export function createTextArea(options) {
    const textArea = document.createElement('textarea');

    let textAreaWrapper = document.createElement('span');
    textAreaWrapper.appendChild(textArea);
    textAreaWrapper.classList.add('textarea-wrapper');

    applyOptionsTo(textArea, options);

    return textAreaWrapper;
}
