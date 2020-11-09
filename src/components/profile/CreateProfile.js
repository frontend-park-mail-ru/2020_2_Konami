'use strict';

const template = require('./ProfileTemplate.pug');

import {
    postUser,
    postPhoto,
} from '../../js/services/API/api.js';

import {
    createEditIcon,
} from './IconWithText/EditIcon.js';


import {
    createBtn
} from "../auth/Button/button.js";

import { displayNotification } from "@/components/auth/Notification/Notification.js";

const conf = [
    {
        name: 'name',
        inputType: 'input',
    },
    {
        name: 'city',
        inputType: 'input',
    },
    {
        name: 'vk',
        inputType: 'input',
    },
    {
        name: 'telegram',
        inputType: 'input',
    },
    {
        name: 'skills',
        inputType: 'textarea',
    },
    {
        name: 'interests',
        inputType: 'textarea',
    },
    {
        name: 'education',
        inputType: 'textarea',
    },
    {
        name: 'job',
        inputType: 'textarea',
    },
    {
        name: 'aims',
        inputType: 'textarea',
    },
];

function createTags(rightColumn, data) {
    const tagsWrapper = document.createElement('div');
    tagsWrapper.classList.add('selectedTagsWrapper');
    tagsWrapper.innerHTML = '';

    // TODO в отдельную функцию
    const tags =  data.interestTags.map((tagValue) => {
        let lbl = document.createElement('label');
        let input = document.createElement('input');
        input.classList.add('btnLike');
        input.name = 'tags';
        input.value = tagValue;

        let span = document.createElement('span');
        span.textContent = tagValue;

        lbl.appendChild(input);
        lbl.appendChild(span);

        return lbl;
    });
    tagsWrapper.append(...tags);

    const editProfileBtn = createBtn('Изменить тэги', {classList: ['stdBtn', 'secondary', 'activable']});

    rightColumn.append(tagsWrapper, editProfileBtn);
}

function createAvatarField(tmp) {
    const avatar = tmp.getElementsByClassName('profile__avatar')[0];
    const fileChooser = tmp.getElementsByClassName('profile__file-chooser')[0];
    const saveButton = tmp.getElementsByClassName('profile__save-button')[0];

    fileChooser.onchange = (event) => {
        var file = event.target.files[0];
        if (file.size/1024/1024 > 4) {
            displayNotification('Файл слишком большой');
            return;
        }
        var FR = new FileReader();

        FR.onload = function(event) {
            avatar.src = event.target.result;
            saveButton.hidden = false;
        };

        FR.readAsDataURL(file);
    };

    saveButton.onclick = () => {
        let blobFile = fileChooser.files[0];
        let formData = new FormData();
        formData.append("fileToUpload", blobFile);
        postPhoto(formData, 'userId', window.userId).then((obj) => {
            if (obj.statusCode === 200) {
                displayNotification("Вы изменили фотографию");
                saveButton.hidden = true;
            } else if (obj.statusCode === 413) {
                displayNotification("Файл слишком большой");
            }
        });
    }
}

function createProfile(data, isAuth) {
    const tmp = document.createElement('div');
    tmp.innerHTML = template(data);

    for (let item of conf) {
        const editedField = tmp.getElementsByClassName(`profile__${item.name}`)[0];
        const editIcon = tmp.getElementsByClassName(`profile__${item.name}-editicon`)[0];
        // mainText.innerHTML = data[id].replace("\n", "<br/>")
        let input;
        if (item.inputType === "textarea") {
            input = createTextArea(editedField.innerHTML);
        } else {
            input = document.createElement('input');
            input.value = editedField.innerHTML;
        }

        addListener(editIcon, editedField, input, () => {
            editedField.innerHTML = input.value;
            editedField.href = input.value;
            const obj = {};
            obj[item.name] = editedField.innerHTML;
            postUser(obj).then(obj =>{
                if (obj.statusCode === 200) {
                    displayNotification("Вы отредактировали профиль");
                } else if (obj.statusCode !== 200) {
                    alert('Permission denied');
                }
            });
        });
    }

    createAvatarField(tmp);
    createTags(tmp.getElementsByClassName('profile__rightcolumn')[0], data);
    

    if (!isAuth) {
        Array.from(tmp.getElementsByClassName('icon-with-text__editicon')).forEach(element => {
            element.remove();
        });
        Array.from(tmp.getElementsByClassName('profile__avatar-overlay')).forEach(element => {
            element.remove();
        });
        Array.from(tmp.getElementsByClassName('stdBtn')).forEach(element => {
            element.remove();
        });

    }

    return tmp.firstElementChild;
}

function createTextArea(value) {
    const input = document.createElement('textarea');
    input.value = value;
    input.rows = '5';
    input.cols = '10';
    input.classList.add('block');

    return input;
}

function addListener(actor, mainText, input, action) {
    actor.addEventListener('click', () => {
        const checkMark = createEditIcon("assets/check-mark.svg");
        const crossMark = createEditIcon("assets/x-mark.svg");

        const returnMainRemoveMarks = () => {
            input.parentNode.insertBefore(mainText, input.nextSibling);
            checkMark.parentNode.insertBefore(actor, checkMark.nextSibling);

            checkMark.remove();
            crossMark.remove();
            input.remove();
        };

        checkMark.addEventListener('click', (evt) => {
            action();
            returnMainRemoveMarks(evt);
        });
        crossMark.addEventListener('click', returnMainRemoveMarks);

        actor.parentNode.insertBefore(checkMark, actor.nextSibling);
        actor.parentNode.insertBefore(crossMark, actor.nextSibling);
        actor.remove();

        mainText.parentNode.insertBefore(input, mainText.nextSibling);
        mainText.remove();
    });
}

export {
    createProfile,
}
