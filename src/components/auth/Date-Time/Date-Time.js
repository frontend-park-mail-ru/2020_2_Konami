'use strict';

import {createInput} from "../Input/Input.js";

export function createDateTimeBlock(prefix) {
    const wrap = document.createElement('div');
    wrap.classList.add('date-time');

    const dateBlock = document.createElement('div');
    dateBlock.classList.add('date-block');

    dateBlock.append(
        createInput({required: 'true', classList: ['birthDay'], name: `${prefix}-day`, placeholder: 'ДД', maxLength: '2'}),
        createInput({required: 'true',classList: ['birthDay'], name: `${prefix}-month`, placeholder: 'ММ', maxLength: '2'}),
        createInput({required: 'true', classList: ['birthDay'], name: `${prefix}-year`, placeholder: 'ГГГГ', maxLength: '4'})
    );

    const timeBlock = document.createElement('div');
    timeBlock.classList.add('time-block');

    timeBlock.appendChild(
        createInput({required: 'true', classList: ['birthDay', 'time-input'], name: `${prefix}-hours`, placeholder: 'ЧЧ', maxLength: '2'}),
    );

    timeBlock.innerHTML += ': ';

    timeBlock.appendChild(
        createInput({required: 'true',classList: ['birthDay', 'time-input'], name: `${prefix}-minutes`, placeholder: 'ММ', maxLength: '2'})
    );

    wrap.append(dateBlock, timeBlock)

    return wrap;
}
