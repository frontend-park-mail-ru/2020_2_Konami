'use strict';

export default class Validator {

     validatePassword(input) {
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
    }

     validateLogin(input) {
        const errors = [];

        if (!/^[a-zA-Zа-яА-я0-9_.-]*$/.test(input)) {
            errors.push('Логин может включать только буквы, цифры и символы _ - .');
        }

        return errors;
    }

     validateName(input) {
        const errors = [];

        if (!/^[A-ZА-ЯЁ]/.test(input)) {
            errors.push('Имя должно начинаться с заглавной буквы');
        }
        return errors;
    }

    isValidDate(day, month, year) {
        day = parseInt(day, 10);
        month = parseInt(month, 10);
        year = parseInt(year, 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month === 0 || month > 12)
            return false;

        let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    }

}
