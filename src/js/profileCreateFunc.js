'use strict';

import {
    postUser,
    postPhoto, postSignOut,
} from '../api/api.js';

import {
    createBoldSpan,
} from '../components/profile/BoldSpan/BoldSpan.js';

import {
    createEditIcon,
} from '../components/profile/EditIcon/EditIcon.js';

import {
    createIconWithText,
} from '../components/profile/IconWithText/IconWithText.js'

import {
    createLink,
} from '../components/profile/Link/Link.js';

import {
    createMetIcon,
} from '../components/profile/MetIcon/MetIcon.js';


function fillRightColumn(rightColumn, data) {
    const fillRigthColumn = [
        {
            iconSrc: 'assets/diamond.svg',
            name: 'Навыки',
            key: 'skills',
        },
        {
            iconSrc: 'assets/search.svg',
            name: 'Интересы',
            key: 'interests',
        },
        {
            iconSrc: 'assets/education.svg',
            name: 'Образование',
            key: 'education',
        },
        {
            iconSrc: 'assets/job.svg',
            name: 'работа',
            key: 'job',
        },
        {
            iconSrc: 'assets/aim.svg',
            name: 'Цели',
            key: 'aims',
        },
    ];


    fillRigthColumn.forEach((item) => {
        const id = item.key;

        const wrap = createIconWithText();
        const editicon = createEditIcon('assets/pen.svg');

        wrap.appendChild(createMetIcon(item.iconSrc));
        wrap.appendChild(createBoldSpan(item.name));
        wrap.appendChild(editicon);

        const mainText = document.createElement('span');
        mainText.classList.add('margin10');
        // mainText.innerHTML = data[id].replace("\n", "<br/>")
        mainText.innerHTML = data[id]
        const input = createTextArea(mainText.innerHTML);

        rightColumn.appendChild(wrap);
        rightColumn.appendChild(mainText);

        addListener(editicon, mainText, input, () => {
            mainText.innerHTML = input.value;

            postUser(id, mainText.innerHTML).then(statusCode =>{
                if (statusCode !== 200) {
                    alert('Permission denied');
                }
            });
        });
    });
}


function createNameField(name) {
    const wrap = createIconWithText();
    const editicon = createEditIcon("assets/pen.svg");

    const mainText = document.createElement('h2');
    mainText.classList.add('name');
    mainText.innerHTML = name;

    wrap.appendChild(mainText);
    wrap.appendChild(editicon);

    const input = document.createElement('input');
    input.value = mainText.innerHTML;

    addListener(editicon, mainText, input, () => {
        mainText.innerHTML = input.value;

        postUser('name', mainText.innerHTML).then(statusCode =>{
            if (statusCode !== 200) {
                alert('Permission denied');
            }
        });
    });

    return wrap;
}


function createCityField(cityName) {
    const wrap = createIconWithText();
    const mainText = document.createElement('span');
    mainText.classList.add('city');
    mainText.innerHTML = cityName;

    const editicon = createEditIcon('assets/pen.svg');

    wrap.appendChild(createMetIcon('assets/place.svg'));
    wrap.appendChild(mainText);
    wrap.appendChild(editicon);

    const input = document.createElement('input');
    input.value = mainText.innerHTML;

    addListener(editicon, mainText, input, () => {
        mainText.innerHTML = input.value;

        postUser('city', mainText.innerHTML).then(statusCode =>{
            if (statusCode !== 200) {
                alert('Permission denied');
            }
        });
    });

    return wrap;
}


function createAvatarField(imgSrc) {
    const avatarWraper = document.createElement('div');
    avatarWraper.classList.add('avatarwraper');

    const overlay = document.createElement('div');
    overlay.classList.add('layout');

    const fileChoser = document.createElement('input');
    fileChoser.accept = 'image/*';
    fileChoser.type = 'file';
    fileChoser.classList.add('button');

    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Сохранить';
    saveButton.classList.add('button');

    saveButton.hidden = true;

    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    avatar.src = imgSrc;

    fileChoser.onchange = (event) => {
        var file = event.target.files[0];
        var FR = new FileReader();
        
        FR.onload = function(event) {
            console.dir(event);
            avatar.src = event.target.result;
            saveButton.hidden = false;
        };
        
        FR.readAsDataURL(file);
    };

    saveButton.onclick = () => {
        let blobFile = fileChoser.files[0];
        let formData = new FormData();
        formData.append("fileToUpload", blobFile);
        postPhoto(formData, 'userId', window.userId);
        saveButton.hidden = true;
    }

    overlay.appendChild(fileChoser);
    overlay.appendChild(saveButton);

    avatarWraper.appendChild(overlay);
    avatarWraper.appendChild(avatar);

    return avatarWraper;
}


function createSocialNetworks(data) {
    const networksConfig = {
        vk: 'assets/vk.png',
        telegram: 'assets/telegram.png',
    };  

    const networkWraper = document.createElement('div');
    networkWraper.classList.add('socialnetworks');

    Object.keys(networksConfig).forEach(key => {
        const input = document.createElement('input');
        const href = data[key];
        const link = createLink("");

        let editicon;
        if (href === "") {
            editicon = createEditIcon('assets/plus.svg');
        } else {
            link.href = href;
            link.innerHTML = href;
            input.value = href;

            editicon = createEditIcon('assets/pen.svg');
        }

        addListener(editicon, link, input, () => {
            link.href = input.value;
            link.innerHTML = input.value;

            editicon.src = 'assets/pen.svg';
            postUser(key, link.innerHTML).then(statusCode =>{
                if (statusCode !== 200) {
                    alert('Permission denied');
                }
            });
        });

        const elem = createIconWithText();
        elem.appendChild(createMetIcon(networksConfig[key]));
        elem.appendChild(link);
        elem.appendChild(editicon);

        networkWraper.appendChild(elem);
    });

    return networkWraper;
}


function createMetings(data) {
    const meetings = document.createElement('div');
    meetings.classList.add('meetings');

    data.meetings.forEach(obj => {
        const iconwithtext = createIconWithText();

        iconwithtext.appendChild(createMetIcon(obj.imgSrc));
        iconwithtext.appendChild(createLink(obj.text));
        
        meetings.appendChild(iconwithtext);
    });

    return meetings;
}


function fillLeftColumn(leftColumn, data) {
    leftColumn.appendChild(createAvatarField(data.imgSrc));
    leftColumn.appendChild(createNameField(data.name));
    leftColumn.appendChild(createCityField(data.city));
    leftColumn.appendChild(document.createElement('hr'));
    leftColumn.appendChild(createSocialNetworks(data));
    leftColumn.appendChild(document.createElement('hr'));

    const wrap = createIconWithText();
    wrap.appendChild(createMetIcon('assets/arrow.svg'));
    wrap.appendChild(createBoldSpan('Мероприятия'));

    leftColumn.appendChild(wrap);
    leftColumn.appendChild(createMetings(data));
}


function createProfile(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = `
    <main class="profilemain">
        <div class="leftcolumn"></div>
        <div class="rightcolumn"></div>
    </main>
    `;

    const rightColumn = tmp.getElementsByClassName('rightcolumn')[0];
    fillRightColumn(rightColumn, data);

    const leftColumn = tmp.getElementsByClassName('leftcolumn')[0];
    fillLeftColumn(leftColumn, data);


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

function addQuitLink() {
    let icon = document.getElementsByClassName('icon')[0];
    let span = document.createElement('span');
    const signout = document.createElement('a');
    signout.href = '/meetings'
    signout.textContent = 'Выйти';
    signout.dataset.section = 'meetings';

    // span.textContent = 'Выйти';
    span.appendChild(signout);
    span.classList.add('popuptext');
    span.id = 'signout';

    const wrapperIcon = document.createElement('div');
    wrapperIcon.classList.add('popup');
    wrapperIcon.append(icon, span);

    document.getElementsByClassName('header')[0].appendChild(wrapperIcon);

    icon.onmouseover = () => {
        let popup = document.getElementById('signout');
        popup.classList.toggle('show');
    }

    signout.addEventListener('click', (evt) => {
        evt.preventDefault();
        postSignOut().then(() => {
            window.userId = NaN
        })
    });
}

export {
    addQuitLink,
    createProfile,
}