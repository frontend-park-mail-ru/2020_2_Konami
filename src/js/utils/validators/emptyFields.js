'use strict';

/**
 * Удаляет из мапы ключи по предикату
 * @param map
 * @param pred - функция предикат, принимает key, value
 * @returns {Map}
 */
export function deleteIf(map, pred) {
    for (let [k, v] of map) {
        if (pred(k,v)) {
            map.delete(k);
        }
    }
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
