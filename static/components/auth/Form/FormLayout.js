import {
    AuthForm,
} from "./Form.js";

import {
    onSignupRedirectPage,
} from '../../../js/signupPageFunc.js';

import {postLogin, postSignUp} from '../../../api/api.js'

export function createLoginFormLayout(application) {
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

    const form = new AuthForm(application, (evt) => {
        evt.preventDefault();

        let input = document.getElementsByName('login')[0];
        const login = input.value.trim();

        input = document.getElementsByName('password')[0];
        const password = input.value.trim();

        (async () => {
            const error = await postLogin(login, password);
            if (error) {

            }
        })()

    });
    form.main.append(loginInput, pwdInput);
    form.footer.append(submitBtn, message);


    return form;
}

export function createSignupFormLayout(application) {
    const loginInput = createLabeledElements('Логин', createInput(
        {type: 'text', placeholder: 'Ваш логин', name: 'login', required: 'true', maxLength: '30'}));

    const passwordInput = createLabeledElements('Придумайте пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'password', required: 'true', maxLength: '30', minLength: '5'}));

    const repeatPasswordInput = createLabeledElements('Повторите пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'repeatPassword', required: 'true', maxLength: '30'}));

    const submitBtn = createBtn('Зарегестрироваться',
        {type: ' submit', classList: ['stdBtn', 'activable']});

    const form = new AuthForm(application, (evt) => {
        evt.preventDefault();

        let input = document.getElementsByName('login')[0];
        const login = input.value.trim();

        input = document.getElementsByName('password')[0];
        const password = input.value.trim();

        input = document.getElementsByName('repeatPassword')[0];
        const repeatPassword = input.value.trim();

        //TODO(Валидатор сложности пароля)
        if (!isValidPassword(password, repeatPassword)) {
            password.classList.add('invalid');
            repeatPassword.classList.add('invalid');
            return
        }

        (async () => {
            const {status, error} = await postSignUp(login, password);
            if (status === 200) {
                onSignupRedirectPage(application);
            }
        })();

    });
    form.main.append(loginInput, passwordInput, repeatPasswordInput);
    form.footer.append(submitBtn);

    return form;
}
