function createSignupFormLayout() {
    const form = document.createElement('form');

    let createColumn = function (options, ...elements) {
        let col = document.createElement('div');
        applyOptionsTo(col, options);

        let fieldSet = document.createElement('fieldset');

        elements.forEach((el) => {
            fieldSet.appendChild(el);
        });

        col.appendChild(fieldSet);

        return col;
    }

    const tab1 = document.createElement('div');
    tab1.classList.add('tab');

    const formsBlock = document.createElement('div');
    formsBlock.classList.add('signup');

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', required: 'true', maxLength: '30'}));

    const emailInput = createLabeledElements('Адрес электронной почты', createInput(
        {type: 'email', placeholder: 'Электронная почта', name: 'email', required: 'true', maxLength: '250'}));

    const profilePhotoBtnLabel = createLabeledElements('Фото профиля');
    const fileUploader = document.createElement('div');
    fileUploader.innerHTML = '<input type="file" name="photos" id="photos" class="inputfile" data-multiple-caption="{count} files selected" multiple="">'
    fileUploader.innerHTML += `<label for="photos"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"> 
        <path d='M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z'>
        </path></svg> <span>Выберите файл…</span></label>`

    const leftCol = createColumn({classList: ['leftcolumn', 'col-2-3']},
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
        createInput({style: "width: 80%", name: "city", placeholder: "Ваш текущий город", maxLength: '30', required: 'true'}
        ));

    const rightCol = createColumn({classList: ['rightcolumn', 'col-1-3']},
        sexSelectorLabel, birthDateLabel, cityInput);
    formsBlock.appendChild(rightCol);

    const separator1 = createLineSeparator('Информация о себе', {classList: ['signup']});

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
    let persInfoRow = document.createElement('div');

    persInfoRow.classList.add('pers-info-row');
    persInfoRow.appendChild(createLabeledElements(
        'В каких сферах вы бы хотели получать рекоммендации?',
        createBtn('+ Добавить рекоммендации', {type: 'button', classList: ['stdBtn', 'secondary', 'activable']})));
    rows.push(persInfoRow);

    const persInfoBlock = createColumn({classList: ['signup', 'pers-info-block']}, ...rows);

    tab1.append(formsBlock, separator1, persInfoBlock);

    const tab2 = document.createElement('div');
    tab2.classList.add('tab');

    const loginPassBlock = document.createElement('div');
    loginPassBlock.classList.add('signup', 'center');

    const loginInput = createLabeledElements('Логин', createInput(
        {type: 'text', placeholder: 'Ваш логин', name: 'login', required: 'true', maxLength: '30'}));

    const passwordInput = createLabeledElements('Придумайте пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'password', required: 'true', maxLength: '30', minLength: '5'}));

    const repeatPasswordInput = createLabeledElements('Повторите пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'repeatPassword', required: 'true', maxLength: '30'}));

    const col = createColumn({classList: ['leftcolumn', 'col-2-3']},
        loginInput, passwordInput, repeatPasswordInput);

    loginPassBlock.appendChild(col);
    tab2.appendChild(loginPassBlock);

    const signupBtnBlock = document.createElement('div')
    signupBtnBlock.classList.add('center');

    const prevBtn = createBtn('Вернуться',
        {id: 'prevBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});
    prevBtn.onclick = () => nextPrev(-1);

    const nextBtn = createBtn('Далее',
        {id: 'nextBtn', type: 'button', classList: ['stdBtn', 'activable', 'done']});
    nextBtn.onclick = () => nextPrev(1);

    signupBtnBlock.append(prevBtn, nextBtn);

    form.append(tab1,tab2, signupBtnBlock);

    return form;
}

function signUpPage(application) {
    application.innerHTML = '';

    createHeader(application);
    createNavigation(application);
    const form = createSignupFormLayout();

    application.appendChild(form);

    showTab(currentTab);

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        let gender = 'male';
        if (document.getElementById('male').checked) {
            gender = 'male';
        } else if (document.getElementById('female').checked) {
            gender = 'female';
        }

        const form = document.querySelector('form');
        let formData = new FormData(form);
        formData.append('gender', gender);

        const photos = document.getElementById('photos').files;
        let cnt = photos.length;
        for (let i = 0; i < cnt; i++) {
            formData.append(photos[i].name, photos[i]);
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/signup", true);
        xhr.onload = function(oEvent) {
            if (xhr.status == 200) {
                console.log('200');
            } else {
                oOutput.innerHTML = "Error " + xhr.status + " occurred when trying to upload your file.<br \/>";
            }
        };

        xhr.send(formData);
    });

    const inputs = document.querySelectorAll( '.inputfile' );
    Array.prototype.forEach.call( inputs, function( input )
    {
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

function nextPrev(n) {
    // This function will figure out which tab to display
    let x = document.getElementsByClassName("tab");
    if (n === 1 && !validateSignupForm()) {
        return false;
    }
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        const submBtn = document.getElementById('nextBtn');
        submBtn.type = 'submit';
        submBtn.click();
        currentTab = 0;
        appConfig.login.open();

        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function showTab(n) {
    // This function will display the specified tab of the form...
    let x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n === (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Зарегестрироваться!";
    } else {
        document.getElementById("nextBtn").innerHTML = "Далее";
    }
}