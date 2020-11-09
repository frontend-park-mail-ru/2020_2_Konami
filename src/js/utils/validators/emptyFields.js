'use strict';

/**
 * Удаляет из мапы ключи по предикату
 * @param map
 * @param pred - функция предикат, принимает key, value
 * @returns {Map}
 */
export function deleteIf(map, pred) {
    map.forEach((value, key) => {
        if (pred(key,value)) {
            map.delete(key);
        }
    })

    return map;
}

/**
 * Проверка на пустой ли объект
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
