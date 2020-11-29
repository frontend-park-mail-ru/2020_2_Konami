'use strict';

import {createLabeledElements} from "../../../components/auth/LabeledElements/LabeledElements.js";
import {createBtn} from "../../../components/auth/Button/button.js";
import {createColumn} from "../../../components/auth/Fieldset/Fieldset.js";
import {createInput} from "../../../components/auth/Input/Input.js";
import {createTextArea} from "../../../components/auth/TextArea/TextArea.js";
import {createFileUploaderWithImg} from "../../../components/auth/FileUploader/FileUploader.js";
import {createModalDialog} from "../../../components/auth/ModalDialog/ModalDialog.js";
import {createDateTimeBlock} from "../../../components/auth/Date-Time/Date-Time.js";

import {createDomTag, TAGS} from '@/js/config/tags.js'
import {
    createDomTab,
    createTabsAndTags,
    createTagFilterTabsWrapper
} from "../../../components/auth/TagsModal/TagsModal";

export function createNewMeetingForm() {
    const form = document.createElement('form');
    const newMeetWrapper = document.createElement('div');
    newMeetWrapper.classList.add('new-meet');

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('new-meet');

    const addTagsBtn = createLabeledElements(
        ' Теги мероприятия',
        createBtn('+ Добавить', {id: 'openModalBtn', type: 'button', classList: ['stdBtn', 'secondary', 'activable']}));

    const helperText = document.createElement('span');
    helperText.classList.add('helpText');
    helperText.textContent = 'Добавьте мероприятию необходимые тэги';

    const {tabsWrapper, tagsWrapper} = createTabsAndTags();

    const applyTagsBtnWrap = document.createElement('div');
    applyTagsBtnWrap.classList.add('footer__button');
    applyTagsBtnWrap.appendChild(createBtn('Применить',
        {id:'closeTagsModal', type:'button', classList: ['stdBtn', 'secondary', 'activable']}));

    const modalBlock = createModalDialog({id:'modalTags', classList: ['modal']}, [helperText, tabsWrapper, tagsWrapper, applyTagsBtnWrap]);

    const selectedTags = document.createElement('div');
    selectedTags.classList.add('selectedTagsWrapper');

    const leftCol = createColumn({classList: ['new-meet__leftcolumn', 'new-meet__col-1-3']}, addTagsBtn, modalBlock);
    leftCol.appendChild(selectedTags);


    const nameInput = createLabeledElements('Название мероприятия', createInput(
        {required: 'true', type: 'text', name: 'name', maxLength: '50'}));

    const descriptionInput = createLabeledElements('Описание мероприятия', createTextArea(
        {/*required: 'true',*/ name: 'meet-description', maxLength: '500'}));

    const emptyMeetImg = document.createElement('img');
    emptyMeetImg.classList.add('meeting-poster');
    emptyMeetImg.src = 'assets/empty-event.png';
    const meetPhotoLabel = createLabeledElements('Обложка мероприятия');
    const fileUploader = createFileUploaderWithImg('photoFileUploader', emptyMeetImg);

    const cityInput = createLabeledElements('Город',
        createInput({required: 'true', name: "city", maxLength: '30'}));

    const addressInput = createLabeledElements('Адрес проведения',
        createInput({required: 'true', name: "address", maxLength: '100'}));

    const start = createLabeledElements('Начало', createDateTimeBlock('start'));
    //     createInput({required: 'true', classList: ['birthDay'], name: 'start-day', placeholder: 'ДД', maxLength: '2'}),
    //     createInput({required: 'true',classList: ['birthDay'], name: 'start-month', placeholder: 'ММ', maxLength: '2'}),
    //     createInput({required: 'true', classList: ['birthDay'], name: 'start-year', placeholder: 'ГГГГ', maxLength: '4'}),
    //     createInput({required: 'true', type: 'time', classList: ['time-input'], name: 'start-time'}));
    // start.querySelector('div').classList.add('date-block');

    const end = createLabeledElements('Конец', createDateTimeBlock('end'));
    //     createInput({required: 'true', classList: ['birthDay'], name: 'end-day', placeholder: 'ДД', maxLength: '2'}),
    //     createInput({required: 'true', classList: ['birthDay'], name: 'end-month', placeholder: 'ММ', maxLength: '2'}),
    //     createInput({required: 'true',classList: ['birthDay'], name: 'end-year', placeholder: 'ГГГГ', maxLength: '4'}),
    //     createInput({required: 'true', type: 'time', classList: ['time-input'], name: 'end-time'}));
    // end.querySelector('div').classList.add('date-block');

    const dates = document.createElement('div');
    dates.classList.add('date');
    dates.append(start, end);

    const rightCol = createColumn({classList: ['new-meet__rightcolumn']},
        nameInput, descriptionInput, meetPhotoLabel, fileUploader, cityInput, addressInput, dates);

    const idInput = createLabeledElements('',
        createInput({required: 'false', name: "id", type: 'text'}));
    idInput.style.display = 'none';
    newMeetWrapper.append(leftCol, rightCol, idInput);

    const btnWrapper = document.createElement('div')
    btnWrapper.classList.add('center');
    btnWrapper.appendChild(createBtn('Опубликовать мероприятие',
        {id: 'publishBtn', type: 'submit', classList: ['stdBtn', 'activable', 'done']}));

    form.append(newMeetWrapper, btnWrapper);

    return form;
}
