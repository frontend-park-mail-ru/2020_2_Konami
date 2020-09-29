function createLoginFormLayout() {
    const form = document.createElement('form');
    form.classList.add('vertical-center');
    const main = document.createElement('main');
    const footer = document.createElement('footer');

    const loginInput = createLabeledElements('Логин',
        createInput({type: 'text', placeholder: 'телефон или email', name: 'login'}));
    const pwdInput = createLabeledElements('Пароль',
        createInput({type: 'password', placeholder: 'пароль', name: 'password'}));
    main.appendChild(loginInput);
    main.appendChild(pwdInput);

    const submitBtn = document.createElement('button');
    const p = document.createElement('p');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Войти';
    p.innerHTML =
        `Нету аккаунта? 
        <a href="${appConfig.registration.href}" data-section="registration">
            Зарегестрироваться
        </a>`;
    p.classList.add('message');
    footer.appendChild(submitBtn);
    footer.appendChild(p);

    form.appendChild(main);
    form.appendChild(footer);

    return form;
}

function loginPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);
    const form = createLoginFormLayout();

    const div = document.createElement('div');
    div.classList.add('login');

    div.appendChild(form);

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        let input = document.getElementsByName('login')[0];
        const login = input.value.trim();

        input = document.getElementsByName('password')[0];
        const password = input.value.trim();

        ajax('POST',
            '/login',
            (status, response) => {
                if (status === 200) {
                    createProfilePage(application);
                } else {
                    const {error} = JSON.parse(response);
                    alert(error);
                }
            },
            {login, password},
        )
    })

    application.appendChild(div);
}