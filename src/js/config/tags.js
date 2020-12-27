'use strict';

export const TAGS = {
    Разработка: [
        'ИТ и интернет',
        'Языки программирования',
        'Технопарк',
        'C++', 'Python', 'JavaScript', 'Golang',
        'Mail.ru', 'Yandex',
        'Образование',
        'Россия'
    ],

    Бизнес: [
        'Аналитика',
        'Финансы',
        'Логистика',
        'Реклама',
        'Менеджмент',

    ],

    Искусство: [
        'Творчество',
        'Театры',
        'Искусство',
        'Культура',
        'Психология',
    ],

    Развлечения: [
        'Кино',
        'Вечеринки',
        'Еда',
        'Концерты',
        'Путешествия',
        'Выставки',
    ],

    Другое: [
        'Хобби',
        'Спорт',
        'Красота',
        'Здоровье',
        'Экскурсии',
    ]

}

export const TAGS_IMGS = {
    Разработка: 'assets/development.png',
    Искусство: 'assets/art.jpg',
    Бизнес: 'assets/buisness.jpg',
    Развлечения: 'assets/paris.jpg',
}

export function createDomTag(tagName, checkable = true) {
    let lbl = document.createElement('label');
    let input = document.createElement('input');

    input.classList.add('btnLike');
    input.type = checkable ? 'checkbox' : 'text';
    input.name = 'tags';
    input.value = tagName;

    let span = document.createElement('span');
    span.textContent = tagName;

    lbl.appendChild(input);
    lbl.appendChild(span);

    return lbl;
}
