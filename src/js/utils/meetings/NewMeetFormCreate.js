'use strict';

import {createLabeledElements} from "../../../components/auth/LabeledElements/LabeledElements.js";
import {createBtn} from "../../../components/auth/Button/button.js";
import {createColumn} from "../../../components/auth/Fieldset/Fieldset.js";
import {createInput} from "../../../components/auth/Input/Input.js";
import {createTextArea} from "../../../components/auth/TextArea/TextArea.js";
import {createFileUploaderWithImg} from "../../../components/auth/FileUploader/FileUploader.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";

export function createNewMeetingForm() {
    const form = document.createElement('form');
    const newMeetWrapper = document.createElement('div');
    newMeetWrapper.classList.add('new-meet');

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('new-meet');

    const addTagsBtn = createLabeledElements(
        ' Теги мерприятия',
        createBtn('+ Добавить', {id: 'openModalBtn', type: 'button', classList: ['stdBtn', 'secondary', 'activable']}));

    // TODO (заполнить нормльными тэгами)
    const tags = document.createElement('div');
    tags.classList.add('recommendationTagsWrapper')
    for (let i = 0; i < 10; i++) {
        let lbl = document.createElement('label');
        let input = document.createElement('input');
        input.classList.add('btnLike');
        input.type = 'checkbox';
        input.name = 'tags';
        input.value = 'randomTag' + i;

        let span = document.createElement('span');
        span.textContent = 'randomTag';

        lbl.appendChild(input);
        lbl.appendChild(span);

        tags.appendChild(lbl);
    }

    const helperText = document.createElement('span');
    helperText.classList.add('helpText');
    helperText.textContent = 'Добавьте мероприятию необходимые тэги';

    const modalBlock = createModalDialog({id:'modalTags', classList: ['modal']}, [helperText, tags]);

    const selectedTags = document.createElement('div');
    selectedTags.classList.add('selectedTagsWrapper');

    const leftCol = createColumn({classList: ['leftcolumn', 'col-1-3']}, addTagsBtn, modalBlock);
    leftCol.appendChild(selectedTags);


    const nameInput = createLabeledElements('Название мероприятия', createInput(
        {/*required: 'true',*/ type: 'text', name: 'name', maxLength: '50'}));

    const descriptionInput = createLabeledElements('Описание мероприятия', createTextArea(
        {/*required: 'true',*/ name: 'meet-description', maxLength: '500'}));

    const emptyMeetImg = document.createElement('img');
    emptyMeetImg.classList.add('meeting-poster');
    emptyMeetImg.src = 'assets/empty-event.png';
    const meetPhotoLabel = createLabeledElements('Обложка мероприятия');
    const fileUploader = createFileUploaderWithImg('photoFileUploader', emptyMeetImg);

    const cityInput = createLabeledElements('Город',
        createInput({/*required: 'true',*/ name: "city", maxLength: '30'}));

    const addressInput = createLabeledElements('Адрес проведения',
        createInput({/*required: 'true',*/ name: "address", maxLength: '100'}));

    const start = createLabeledElements('Начало',
        createInput({/*required: 'true',*/ classList: ['birthDay'], name: 'start-day', placeholder: 'ДД', maxLength: '2'}),
        createInput({/*required: 'true',*/classList: ['birthDay'], name: 'start-month', placeholder: 'ММ', maxLength: '2'}),
        createInput({/*required: 'true',*/ classList: ['birthDay'], name: 'start-year', placeholder: 'ГГГГ', maxLength: '4'}),
        createInput({/*required: 'true',*/ type: 'time', classList: ['time-input'], name: 'start-time'}));
    start.querySelector('div').classList.add('date-block');

    const end = createLabeledElements('Конец',
        createInput({/*required: 'true',*/ classList: ['birthDay'], name: 'end-day', placeholder: 'ДД', maxLength: '2'}),
        createInput({/*required: 'true',*/ classList: ['birthDay'], name: 'end-month', placeholder: 'ММ', maxLength: '2'}),
        createInput({/*required: 'true',*/classList: ['birthDay'], name: 'end-year', placeholder: 'ГГГГ', maxLength: '4'}),
        createInput({/*required: 'true',*/ type: 'time', classList: ['time-input'], name: 'end-time'}));
    end.querySelector('div').classList.add('date-block');

    const dates = document.createElement('div');
    dates.classList.add('date');
    dates.append(start, end);

    const rightCol = createColumn({classList: ['rightcolumn']},
        nameInput, descriptionInput, meetPhotoLabel, fileUploader, cityInput, addressInput, dates);
    newMeetWrapper.append(leftCol, rightCol);

    const btnWrapper = document.createElement('div')
    btnWrapper.classList.add('center');
    btnWrapper.appendChild(createBtn('Опубликовать мероприятие',
        {id: 'publishBtn', type: 'submit', classList: ['stdBtn', 'activable', 'done']}));

    form.append(newMeetWrapper, btnWrapper);

    return form;
}
