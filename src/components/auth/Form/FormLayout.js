import {
    AuthForm,
} from "./Form.js";

import {createLabeledElements} from "../LabeledElements/LabeledElements.js";
import {createInput} from "../Input/Input.js";
import {createBtn} from "../Button/button.js";

export function createLoginFormLayout(application) {
    const loginInput = createLabeledElements('Логин',
        createInput({type: 'text', required: 'true', name: 'login'}));
    const pwdInput = createLabeledElements('Пароль',
        createInput({type: 'password', name: 'password', required: 'true'}));
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML =
        'Вы ввели неверный логин или пароль';
    errorMessage.classList.add('error-message');
    errorMessage.style.display = 'none';

    const submitBtn = createBtn('Войти',
        {type: ' submit', classList: ['stdBtn', 'activable']});
    const message = document.createElement('p');
    message.innerHTML =
        `Нет аккаунта? 
        <a>
            Зарегистрироваться
        </a>`;
    message.classList.add('message');

    const form = new AuthForm(application);


    form.main.append(loginInput, pwdInput, errorMessage);
    form.footer.append(submitBtn, message);


    return form;
}

export function createSignupFormLayout(application) {
    const loginInput = createLabeledElements('Логин', createInput(
        {type: 'text', placeholder: 'Ваш логин', name: 'login', required: 'true', maxLength: '30'}));

    const passwordInput = createLabeledElements('Придумайте пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'password', required: 'true', maxLength: '30', minLength: '0'}));

    const repeatPasswordInput = createLabeledElements('Повторите пароль', createInput(
        {type: 'password', placeholder: 'Пароль', name: 'repeatPassword', required: 'true', maxLength: '30'}));

    const nameInput = createLabeledElements('Имя', createInput(
        {type: 'text', placeholder: 'Полное имя', name: 'name', required: 'true', maxLength: '30'}));

    const errorMessage = document.createElement('p');
    errorMessage.innerHTML =
    errorMessage.classList.add('error-message');
    errorMessage.style.display = 'none';

    const submitBtn = createBtn('Зарегистрироваться',
        {type: ' submit', classList: ['stdBtn', 'activable']});

    const form = new AuthForm(application);
    form.main.append(loginInput, passwordInput, repeatPasswordInput, nameInput, errorMessage);
    form.footer.append(submitBtn);

    return form;
}
