'use strict';
import {createLabeledElements} from "@/components/auth/LabeledElements/LabeledElements.js";
import {createInput} from "@/components/auth/Input/Input.js";
import {createRadioBtn} from "@/components/auth/RadioBtn/RadioBtn.js";
import {createBtn} from "@/components/auth/Button/button.js";
import {createLineSeparator} from "@/components/auth/LineSeparator/LineSeparator.js";
import {createModalDialog} from "@/components/auth/ModalDialog/ModalDialog.js";
import {createFileUploader} from "@/components/auth/FileUploader/FileUploader.js";
import {createColumn} from "@/components/auth/Fieldset/Fieldset.js";

import {createDomTag, TAGS} from '@/js/config/tags.js'

export function createEditProfileForm() {
    const form = document.createElement('form');

    const tab1 = createTab1();
    const tab2 = createTab2();
    const btnsBlock = createButtonsBlock();

    form.append(tab1, tab2,  btnsBlock);

    return form;
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

    const leftCol = createColumn({classList: ['leftcolumn', 'signup__col-2-3']},
        nameInput, emailInput, profilePhotoBtnLabel, fileUploader);

    formsBlock.appendChild(leftCol);

    const radioBtnWrapper = document.createElement('div');
    radioBtnWrapper.classList.add('form_radio_btn_wrapper');

    radioBtnWrapper.append(
        createRadioBtn('male', 'Мужчина', 'gender', 'male', {classList:['form_radio_btn']}),
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

    const rightCol = createColumn({classList: ['rightcolumn', 'signup__col-1-3']},
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
    tags.classList.add('recommendationTagsWrapper');
    tags.append(...TAGS.map((tagName) => createDomTag(tagName)));
    // for (let i = 0; i < 10; i++) {
    //     let lbl = document.createElement('label');
    //     lbl.id = 'tag' + i;
    //
    //     let input = document.createElement('input');
    //     input.classList.add('btnLike');
    //     input.type = 'checkbox';
    //     input.name = 'tags';
    //     input.value = 'randomTag' + i;
    //
    //     let span = document.createElement('span');
    //     span.textContent = 'randomTag';
    //
    //     lbl.appendChild(input);
    //     lbl.appendChild(span);
    //
    //     tags.appendChild(lbl);
    // }

    const helperText = document.createElement('span');
    helperText.classList.add('helpText');
    helperText.textContent = 'Добавьте интересы в свой профиль, чтобы получать персональные рекомендации';

    const applyTagsBtnWrap = document.createElement('div');
    applyTagsBtnWrap.classList.add('footer__button');
    applyTagsBtnWrap.appendChild(createBtn('Применить',
        {id:'closeTagsModal', type:'button', classList: ['stdBtn', 'secondary', 'activable']}));

    const modalBlock = createModalDialog({id:'modalTags', classList: ['modal']}, [helperText, tags, applyTagsBtnWrap]);

    tab2.appendChild(
        createLineSeparator('Вы можете указать сферы, в каких хотели бы получать рекомендации',
            {classList: ['signup']})
    )
    tab2.append(persInfoBlock, modalBlock);
    return tab2;
}

// function createTab3() {
//     const tab3 = document.createElement('div');
//     tab3.classList.add('tab');
//
//     const rowsLbls = {'Ключевые навыки' : 'skills',
//         'Основные интересы' : 'interests',
//         'Цели' : 'goals'};
//     let rows = [];
//     Object.keys(rowsLbls).forEach((lbl) => {
//         let persInfoRow = document.createElement('div');
//         persInfoRow.classList.add('pers-info-row');
//
//         let textArea = document.createElement('textarea');
//         textArea.name = rowsLbls[lbl];
//         textArea.maxLength = 300;
//
//         let textAreaWrapper = document.createElement('span');
//         textAreaWrapper.appendChild(textArea);
//         textAreaWrapper.classList.add('textarea-wrapper');
//
//         persInfoRow.appendChild(createLabeledElements(lbl, textAreaWrapper));
//         rows.push(persInfoRow);
//     });
//
//     const persInfoBlock = createColumn({classList: ['signup', 'pers-info-block']}, ...rows);
//
//     tab3.appendChild(
//         createLineSeparator('Вы можете указать дополнительную информацию о себе (необязательно)',
//             {classList: ['signup']})
//     );
//     tab3.appendChild(persInfoBlock);
//     return tab3;
// }

function createButtonsBlock() {
    const signupBtnBlock = document.createElement('div')
    signupBtnBlock.classList.add('center');

    const prevBtn = createBtn('Вернуться',
        {id: 'prevBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});

    const nextBtn = createBtn('Далее',
        {id: 'nextBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});

    signupBtnBlock.append(prevBtn, nextBtn);

    return signupBtnBlock;
}
