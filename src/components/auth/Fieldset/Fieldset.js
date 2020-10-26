'use strict';

import {applyOptionsTo} from "../utils.js";

export function createColumn (options, ...elements) {
    let col = document.createElement('div');
    applyOptionsTo(col, options);

    let fieldSet = document.createElement('Fieldset');

    elements.forEach((el) => {
        fieldSet.appendChild(el);
    });

    col.appendChild(fieldSet);

    return col;
}
