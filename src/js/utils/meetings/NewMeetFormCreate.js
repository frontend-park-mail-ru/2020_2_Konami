'use strict';

import {createLabeledElements} from "../../../components/auth/LabeledElements/LabeledElements.js";
import {createBtn} from "../../../components/auth/Button/button.js";
import {createColumn} from "../../../components/auth/Fieldset/Fieldset.js";
import {createInput} from "../../../components/auth/Input/Input.js";
import {createTextArea} from "../../../components/auth/TextArea/TextArea.js";

export function createNewMeetingForm() {
    const form = document.createElement('form');


    const divWrapper = document.createElement('div');
    divWrapper.classList.add('new-meet');

    const addTagsBtn = createLabeledElements(
        ' Теги мерприятия',
        createBtn('+ Добавить', {id: 'openModalBtn', type: 'button', classList: ['stdBtn', 'secondary', 'activable']}));

    const leftCol = createColumn({classList: ['leftcolumn', 'col-1-3']}, addTagsBtn);


    const nameInput = createLabeledElements('Название мероприятия', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', maxLength: '50'}));

    const descriptionInput = createLabeledElements('Описание мероприятия', createTextArea(
        {name: 'meet-description', maxLength: '500'}));



    const rightCol = createColumn({classList: ['rightcolumn']}, nameInput, descriptionInput);





    return form;
}
