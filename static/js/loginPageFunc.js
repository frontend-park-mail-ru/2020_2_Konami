function createLoginFormLayout() {
    const loginInput = createLabeledElements('Логин',
        createInput({type: 'text', placeholder: 'телефон или email', name: 'login'}));
    const pwdInput = createLabeledElements('Пароль',
        createInput({type: 'password', placeholder: 'пароль', name: 'password'}));

    const submitBtn = createBtn('Войти',
        {type: ' submit', classList: ['stdBtn', 'activable']});
    const message = document.createElement('p');
    message.innerHTML =
        `Нету аккаунта? 
        <a href="${appConfig.registration.href}" data-section="registration">
            Зарегестрироваться
        </a>`;
    message.classList.add('message');

    const form = createAuthForm([loginInput, pwdInput], [submitBtn, message]);

    return form;
}

function loginPage(application) {
    application.innerHTML = '';
    createHeader(application);
    createNavigation(application);
    const form = createLoginFormLayout();

    const div = document.createElement('div');
    div.classList.add('authForm');

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
                    createProfilePage(application, window.userId);
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
