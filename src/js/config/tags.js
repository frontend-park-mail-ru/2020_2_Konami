'use strict';

export const TAGS = {
    Разработка: [
        'ИТ и интернет',
        'Языки программирования',
        'C++', 'Python', 'JavaScript', 'Golang',
        'Mail.ru', 'Yandex',
        'Бизнес',
        'Хобби',
        'Кино',
        'Вечеринки',
        'Еда',
        'Концерты',
        'Спорт',
        'Красота',
        'Здоровье',
        'Наука',
        'Выставки',
        'Экскурсии',
        'Путешествия',
        'Психология',
        'Образование',
        'Россия'
    ],

    Исскуство: [
        'Творчество',
        'Театры',
        'Искусство',
        'Культура',
    ]
}

export const TAGS_IMGS = {
    Разработка: 'assets/development.png',
    Исскуство: 'assets/art.jpg'
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
