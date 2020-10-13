'use strict';

import {
    createNavigation,
} from '../../components/header/Navigation/navigation.js';

import {
    createHeader,
} from '../../components/header/Header/header.js';
import {postPhoto} from "../services/API/api.js";
import {applyOptionsTo} from "../../components/auth/utils.js";
import {createLabeledElements} from "../../components/auth/LabeledElements/LabeledElements.js";
import {createInput} from "../../components/auth/Input/Input.js";
import {createRadioBtn} from "../../components/auth/RadioBtn/RadioBtn.js";
import {createBtn} from "../../components/auth/Button/button.js";
import {createLineSeparator} from "../../components/auth/LineSeparator/LineSeparator.js";
import {createModalDialog} from "../../components/auth/ModalDialog/ModalDialog.js";
import {createSelectedTag} from "../../components/auth/SelectedTag/SelectedTag.js";
import {createFileUploader} from "../../components/auth/FileUploader/FileUploader.js";
import {validateSignupInputForm} from "./formValidators.js";

export var CurrentTab = 0;

export function onSignupRedirectEditProfile(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);

    const form = createSignupEditProfileForm(application);
    application.appendChild(form);

    showTab(CurrentTab);

    addInputFileChangeEventListeners();
    addSubmitFormEventListener();
    addTagsModalDialogEventListener();

}

function createSignupEditProfileForm() {
    const form = document.createElement('form');

    const tab1 = createTab1();
    const tab2 = createTab2();
    const btnsBlock = createButtonsBlock();

    form.append(tab1, tab2,  btnsBlock);

    return form;
}

function createColumn (options, ...elements) {
    let col = document.createElement('div');
    applyOptionsTo(col, options);

    let fieldSet = document.createElement('fieldset');

    elements.forEach((el) => {
        fieldSet.appendChild(el);
    });

    col.appendChild(fieldSet);

    return col;
}

function createTab2() {
    const tab1 = document.createElement('div');
    tab1.classList.add('tab');

    const formsBlock = document.createElement('div');
    formsBlock.classList.add('signup');

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', maxLength: '30'}));

    const emailInput = createLabeledElements('Адрес электронной почты', createInput(
        {type: 'email', placeholder: 'Электронная почта', name: 'email', maxLength: '250'}));

    const profilePhotoBtnLabel = createLabeledElements('Фото профиля');
    const fileUploader = createFileUploader('photoFileUploader');

    const leftCol = createColumn({classList: ['leftcolumn', 'col-2-3']},
        nameInput, emailInput, profilePhotoBtnLabel, fileUploader);

    formsBlock.appendChild(leftCol);

    const radioBtnWrapper = document.createElement('div');
    radioBtnWrapper.classList.add('form_radio_btn_wrapper');

    radioBtnWrapper.append(
        createRadioBtn('male', 'Мужчина', 'gender', 'male', {classList:['form_radio_btn']}, true),
        createRadioBtn('female', 'Женщина',  'gender', 'female', {classList:['form_radio_btn']}));
    const sexSelectorLabel = createLabeledElements('Пол', radioBtnWrapper);

    const birthDateLabel = createLabeledElements('День рождения',
        createInput({classList: ['birthDay'], name: 'day', placeholder: 'ДД', maxLength: '2'}),
        createInput({classList: ['birthDay'], name: 'month', placeholder: 'ММ', maxLength: '2'}),
        createInput({classList: ['birthDay'], name: 'year', placeholder: 'ГГГГ', maxLength: '4'}),
    );

    const cityInput = createLabeledElements('Город',
        createInput({style: "width: 80%", name: "city", placeholder: "Ваш текущий город", maxLength: '30'}
        ));

    const rightCol = createColumn({classList: ['rightcolumn', 'col-1-3']},
        sexSelectorLabel, birthDateLabel, cityInput);
    formsBlock.appendChild(rightCol);

    tab1.appendChild(
        createLineSeparator('Вы можете заполнить информацию о себе (необязательно)', {classList: ['signup']}))
    tab1.appendChild(formsBlock);
    return tab1;
}

function createTab1() {
    const tab2 = document.createElement('div');
    tab2.classList.add('tab');

    let persInfoRow = document.createElement('div');

    persInfoRow.classList.add('pers-info-row');
    persInfoRow.appendChild(createLabeledElements(
        'В каких сферах вы бы хотели получать рекомендации?',
        createBtn('+ Добавить рекомендации', {id: 'openModalBtn', type: 'button', classList: ['stdBtn', 'secondary', 'activable']})));

    const selectedTags = document.createElement('div');
    selectedTags.classList.add('selectedTagsWrapper');

    const persInfoBlock = createColumn({classList: ['signup', 'pers-info-block']}, persInfoRow, selectedTags);


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
    helperText.textContent = 'Добавьте интересы в свой профиль, чтобы получать персональные рекомендации';

    const modalBlock = createModalDialog({id:'modalTags', classList: ['modal']}, [helperText, tags]);

    tab2.appendChild(
        createLineSeparator('Вы можете указать сферы, в каких хотели бы получать рекомендации',
            {classList: ['signup']})
    )
    tab2.append(persInfoBlock, modalBlock);
    return tab2;
}

function createTab3() {
    const tab3 = document.createElement('div');
    tab3.classList.add('tab');

    const rowsLbls = {'Ключевые навыки' : 'skills',
        'Основные интересы' : 'interests',
        'Цели' : 'goals'};
    let rows = [];
    Object.keys(rowsLbls).forEach((lbl) => {
        let persInfoRow = document.createElement('div');
        persInfoRow.classList.add('pers-info-row');

        let textArea = document.createElement('textarea');
        textArea.name = rowsLbls[lbl];
        textArea.maxLength = 300;

        let textAreaWrapper = document.createElement('span');
        textAreaWrapper.appendChild(textArea);
        textAreaWrapper.classList.add('textarea-wrapper');

        persInfoRow.appendChild(createLabeledElements(lbl, textAreaWrapper));
        rows.push(persInfoRow);
    });

    const persInfoBlock = createColumn({classList: ['signup', 'pers-info-block']}, ...rows);

    tab3.appendChild(
        createLineSeparator('Вы можете указать дополнительную информацию о себе (необязательно)',
            {classList: ['signup']})
    );
    tab3.appendChild(persInfoBlock);
    return tab3;
}

function createButtonsBlock() {
    const signupBtnBlock = document.createElement('div')
    signupBtnBlock.classList.add('center');

    const prevBtn = createBtn('Вернуться',
        {id: 'prevBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});
    prevBtn.onclick = () => nextPrev(-1);

    const nextBtn = createBtn('Далее',
        {id: 'nextBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});
    nextBtn.onclick = () => nextPrev(1);

    signupBtnBlock.append(prevBtn, nextBtn);

    return signupBtnBlock;
}

function nextPrev(n) {
    // This function will figure out which tab to display
    let x = document.getElementsByClassName("tab");
    if (n === 1 && !validateSignupInputForm()) {
        return false;
    }
    // Hide the current tab:
    x[CurrentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    CurrentTab = CurrentTab + n;
    // if you have reached the end of the Form...
    if (CurrentTab >= x.length) {
        const submBtn = document.getElementById('nextBtn');
        submBtn.type = 'submit';
        submBtn.click();
        CurrentTab = 0;
        appConfig.meetings.open();

        return false;
    }
    // Otherwise, display the correct tab:
    showTab(CurrentTab);
}

function showTab(n) {
    // This function will display the specified tab of the Form...
    let x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n === (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Применить";
    } else {
        document.getElementById("nextBtn").innerHTML = "Далее";
    }
}

function addSubmitFormEventListener() {
    const form = document.forms[1];

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        const nameValue = document.getElementsByName('name')[0].value;
        const emailValue = document.getElementsByName('email')[0].value;
        const dayValue = document.getElementsByName('day')[0].value;
        const monthValue = document.getElementsByName('month')[0].value;
        const yearValue = document.getElementsByName('year')[0].value;

        const cityValue = document.getElementsByName('city')[0].value;

        let genderValue = 'M';
        if (document.getElementById('male').checked) {
            genderValue = 'M';
        } else if (document.getElementById('female').checked) {
            genderValue = 'F';
        }

        const selectedTags = Array.from(document.getElementsByClassName('selectedTag'));
        const meetTagsValues = selectedTags.map((tag) => {
            return tag.textContent;
        });

        let birthday = ""
        if (yearValue.length && monthValue.length && dayValue.length) {
            birthday = yearValue + '-' + monthValue + '-' + dayValue
        }
        let bodyFields = {
            name: nameValue,
            email: emailValue,
            birthday: birthday,
            city: cityValue,
            gender: genderValue,
            meetingTags: meetTagsValues,
        }

        let formData = new FormData();
        const photos = document.getElementById('photoFileUploader').files;
        let cnt = photos.length;
        if (cnt > 0) {
            formData.append("fileToUpload", photos[0]);
        }
        ajax(
            'POST',
            '/user',
            (status, response) => {
                if (status === 200) {
                    postPhoto(formData).then(response => {
                        appConfig.profile.open()
                    });
                }
            },
            bodyFields
            )
    });
}

function addInputFileChangeEventListeners() {
    const inputs = document.querySelectorAll( '.inputfile' );
    Array.prototype.forEach.call( inputs, function( input ) {
        let label	 = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener( 'change', function( e )
        {
            let fileName = '';
            if( this.files && this.files.length > 1 )
                fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
                fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
                label.querySelector( 'span' ).innerHTML = fileName;
            else
                label.innerHTML = labelVal;
        });
    });
}

function addTagsModalDialogEventListener() {
    let modal = document.getElementById("modalTags");

// Get the button that opens the modal
    let btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
    const close = modal.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

// When the user clicks on <span> (x), close the modal
    close.onclick = function() {
        modal.style.display = "none";
        saveSelectedTags();
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            saveSelectedTags();
        }
    }
}

function saveSelectedTags() {
    const tags = Array.from(document.getElementsByClassName('btnLike'));
    const selectedTagValues = []
    tags.forEach((tag) => {
        if (tag.checked) {
            selectedTagValues.push(tag.value);
        }
    });

    const selectedTagsBlock = document.getElementsByClassName('selectedTagsWrapper')[0];
    selectedTagsBlock.innerHTML = '';

    const selectedTags = selectedTagValues.map((tagValue) => createSelectedTag(tagValue));
    selectedTagsBlock.append(...selectedTags);
}
