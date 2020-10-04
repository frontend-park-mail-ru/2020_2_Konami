'use strict';

import {
    createNavigation,
} from '../components/header/Navigation/navigation.js';

import {
    createHeader,
} from '../components/header/Header/header.js';

export function onSignupRedirectPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);

    const form = createSignupEditProfileForm(application);
    application.appendChild(form);

    showTab(window.CurrentTab);

    addInputFileChangeEventListeners();
    addSubmitFormEventListener();
    addTagsModalDialogEventListener();

}

function createSignupEditProfileForm() {
    const form = document.createElement('form');

    const tab1 = createTab1();
    const tab2 = createTab2();
    const tab3 = createTab3();
    const btnsBlock = createButtonsBlock();

    form.append(tab1, tab2, tab3, btnsBlock);

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

function createTab1() {
    const tab1 = document.createElement('div');
    tab1.classList.add('tab');

    const formsBlock = document.createElement('div');
    formsBlock.classList.add('signup');

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', required: 'true', maxLength: '30'}));

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

function createTab2() {
    const tab2 = document.createElement('div');
    tab2.classList.add('tab');

    let persInfoRow = document.createElement('div');

    persInfoRow.classList.add('pers-info-row');
    persInfoRow.appendChild(createLabeledElements(
        'В каких сферах вы бы хотели получать рекоммендации?',
        createBtn('+ Добавить рекоммендации', {id: 'openModalBtn', type: 'button', classList: ['stdBtn', 'secondary', 'activable']})));

    const selectedTags = document.createElement('div');
    selectedTags.classList.add('selectedTagsWrapper');

    const persInfoBlock = createColumn({classList: ['signup', 'pers-info-block']}, persInfoRow, selectedTags);

    const modalBlock = createModalDialog();

    tab2.appendChild(
        createLineSeparator('Вы можете указать сферы, в каких хотели бы получать рекоммендации',
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
    x[window.CurrentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    window.CurrentTab = window.CurrentTab + n;
    // if you have reached the end of the Form...
    if (window.CurrentTab >= x.length) {
        const submBtn = document.getElementById('nextBtn');
        submBtn.type = 'submit';
        submBtn.click();
        window.CurrentTab = 0;
        appConfig.meetings.open();

        return false;
    }
    // Otherwise, display the correct tab:
    showTab(window.CurrentTab);
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
    const form = document.forms[0];

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        const form = document.querySelector('Form');
        let formData = new FormData(form);

        let gender = 'male';
        if (document.getElementById('male').checked) {
            gender = 'male';
        } else if (document.getElementById('female').checked) {
            gender = 'female';

        }
        formData.append('gender', gender);

        const photos = document.getElementById('photoFileUploader').files;
        let cnt = photos.length;
        for (let i = 0; i < cnt; i++) {
            formData.append(photos[i].name, photos[i]);
        }

        const selectedTags = Array.from(document.getElementsByClassName('selectedTag'));
        const tagValues = selectedTags.map((tag) => {
            return tag.textContent;
        });

        formData.append('tags', JSON.stringify(tagValues));

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/edit_on_signup", true);
        xhr.onload = function(oEvent) {
            if (xhr.status == 200) {
                console.log('200');
            }
        };

        xhr.send(formData);
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
//     var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

// When the user clicks on <span> (x), close the modal
//     span.onclick = function() {
//         modal.style.display = "none";
//     }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";

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
    }
}
