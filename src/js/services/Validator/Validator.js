'use strict';

export default class Validator {

     validatePassword = (input) => {
        const errors = [];

        if (!/[0-9]/.test(input)) {
            errors.push('Пароль должен содержать цифры');
        }
        if (input.match(/\d+/g)) {
            if (input.match(/\d+/g).join('').length < 2) {
                errors.push('Пароль должен содержать 2 цифры');
            }
        }
        if (!/[A-z]/.test(input)) {
            errors.push('Пароль должен содержать латинские буквы');
        }
        if (!/^[\w\dA-z]+$/.test(input)) {
            errors.push('Пароль должен состоять из цифр и латинских букв');
        }

        return errors;
    };

     validateLogin = (input) => {
        const errors = [];

        if (!/^[a-zA-Zа-яА-я0-9_.-]*$/.test(input)) {
            errors.push('Логин может включать только буквы, цифры и символы _ - .');
        }

        return errors;
    }

     validateName = (input) => {
        const errors = [];

        if (!/^[A-ZА-ЯЁ]/.test(input)) {
            errors.push('Имя должно начинаться с заглавной буквы');
        }
        return errors;
    }

}
