import {
    AuthForm,
} from "./Form.js";

import {
    onSignupRedirectEditProfile,
} from '../../../js/auth/onSignupRedirectEditProfile.js';

import {postLogin, postSignUp, postUser} from '../../../js/services/API/api.js'
import {createLabeledElements} from "../LabeledElements/LabeledElements.js";
import {createInput} from "../Input/Input.js";
import {createBtn} from "../Button/button.js";
import {isValidPassword} from "../../../js/auth/formValidators.js";

export function createLoginFormLayout(application) {
    const loginInput = createLabeledElements('Логин',
        createInput({type: 'text', name: 'login'}));
    const pwdInput = createLabeledElements('Пароль',
        createInput({type: 'password', name: 'password'}));
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML =
        'Вы ввели неверный логин или пароль';
    errorMessage.classList.add('errorMessage');
    errorMessage.style.display = 'none';

    const submitBtn = createBtn('Войти',
        {type: ' submit', classList: ['stdBtn', 'activable']});
    const message = document.createElement('p');
    message.innerHTML =
        `Нет аккаунта? 
        <a href="${appConfig.registration.href}" data-section="registration">
            Зарегистрироваться
        </a>`;
    message.classList.add('message');

    const form = new AuthForm(application, (evt) => {
        evt.preventDefault();

        let input = document.getElementsByName('login')[0];
        const login = input.value.trim();

        input = document.getElementsByName('password')[0];
        const password = input.value.trim();

        (async () => {
            const {status, error} = await postLogin(login, password);
            if (status === 400) {
                errorMessage.style.display = 'block';
            }

            if (status === 200) {
                appConfig.profile.open();
            }
        })()

    });


    form.main.append(loginInput, pwdInput, errorMessage);
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

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', required: 'true', maxLength: '30'}));

    const submitBtn = createBtn('Зарегистрироваться',
        {type: ' submit', classList: ['stdBtn', 'activable']});

    const form = new AuthForm(application, (evt) => {
        evt.preventDefault();

        let input = document.getElementsByName('login')[0];
        const login = input.value.trim();

        input = document.getElementsByName('password')[0];
        const password = input.value.trim();

        input = document.getElementsByName('repeatPassword')[0];
        const repeatPassword = input.value.trim();

        input = document.getElementsByName('name')[0];
        const name = input.value.trim();

        //TODO(Валидатор сложности пароля)
        if (!isValidPassword(password, repeatPassword)) {
            password.classList.add('invalid');
            repeatPassword.classList.add('invalid');
            return
        }

        (async () => {
            const {status, error} = await postSignUp(login, password);
            if (status === 200) {
                const {status, error} = await postLogin(login, password);
                postUser('name', name).then(statusCode =>{
                    if (statusCode !== 200) {
                        alert('Permission denied');
                    }
                });
                onSignupRedirectEditProfile(application);
            }
        })();

    });
    form.main.append(loginInput, passwordInput, repeatPasswordInput, nameInput);
    form.footer.append(submitBtn);

    return form;
}
