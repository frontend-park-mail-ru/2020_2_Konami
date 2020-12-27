'use strict';

import  BaseView from "@/js/basics/BaseView/BaseView.js";
import EventBus from "@/js/services/EventBus/EventBus.js";
import {createNewMeetingForm} from "@/js/utils/meetings/NewMeetFormCreate.js";
import {inputFileChangedEventListener} from "@/components/auth/FileUploader/FileUploader.js";
import {saveSelectedTags} from "@/components/auth/SelectedTag/SelectedTag.js";
import {deleteIf} from "@/js/utils/validators/emptyFields.js";
import {closeTagsModalDialog} from "@/components/auth/SelectedTag/SelectedTag.js";
import {addTagsModalDialogEventListener} from "@/components/auth/SelectedTag/SelectedTag.js";
import {displayNotification} from "@/components/auth/Notification/Notification.js";
import {newDate} from "@/components/auth/Date-Time/Date-Time.js";

import {
    OPEN_LOGIN_MODAL, REDIRECT,
    CLOSE_TAGS_MODAL,
    USER_NOT_AUTHORIZED,
    SUBMIT_CREATE_MEET,
    CREATE_MEETING_SUCCESS,
    INVALID_DATE_INPUT,
    INVALID_TIME_INPUT,
    INVALID_START_BIGGER_END,
    BIG_FILE_SIZE,
    APPLY_TAGS_MODAL
} from "@/js/services/EventBus/EventTypes.js";
import {createEmptyBlock} from "@/components/main/EmptyBlock/EmptyBlock";

export default class NewMeetingView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

        this.needSetGeoposition = true;

        this.myMap = null;

        this._initEventHandlers();
    }

    initYmap() {
        this.myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 9
        });

        if (this.needSetGeoposition) {
            this._setUserGeolocation.call(this);
        }
    }

    _initEventHandlers() {
        this._eventHandlers = {

            onNotAuthorized: () => {
                EventBus.dispatchEvent(OPEN_LOGIN_MODAL);
            },

            onInvalidDate: (data) => {
                const {prefix} = data;
                const day = document.getElementsByName(`${prefix}-day`)[0];
                const month = document.getElementsByName(`${prefix}-month`)[0];
                const year = document.getElementsByName(`${prefix}-year`)[0];
                this._showInvalidInputs(day, month, year);
            },

            onInvalidTime: (data) => {
                const {prefix} = data;
                const h = document.getElementsByName(`${prefix}-hours`)[0];
                const m = document.getElementsByName(`${prefix}-minutes`)[0];
                this._showInvalidInputs(h, m);
            },

            onInvalidFile: () => {
                displayNotification('Файл превышает максимальный размер');
            },

            onStartBiggerEnd: () => {
                displayNotification('Дата начала мероприятия не может превышать дату окончания');
                ['start', 'end'].forEach((prefix) => {
                    let day = document.getElementsByName(`${prefix}-day`)[0];
                    let month = document.getElementsByName(`${prefix}-month`)[0];
                    let year = document.getElementsByName(`${prefix}-year`)[0];
                    this._showInvalidInputs(day, month, year);
                });
            },

            onSelectTags: () => {
                saveSelectedTags();
            },

            onSubmitForm: (fields) => {
                if (fields.id) {
                    delete fields.id;
                }

                this.model.createMeeting(fields);
            },

            onCreateSuccess: () => {
                EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
                displayNotification('Вы успешно создали мероприятие');
            }

        }
    }

    render() {
        this._empty = createEmptyBlock();
        this.parent.appendChild(this._empty);

        const form = createNewMeetingForm();
        this.parent.appendChild(form);

        ymaps.ready(this.initYmap.bind(this));

        this._initDefaultDateTimeInputValues();
        // if (this.needSetGeoposition) {
        //     this._setUserGeolocation();
        // }
        this._addEventListeners();
    }

    erase() {
        const form = document.forms[0];
        if (form !== undefined) {
            this.parent.removeChild(form);
        }

        this._empty.remove();
        window.removeEventListener('click', closeTagsModalDialog);
    }

    registerEvents() {
        EventBus.onEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.onEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.onEvent(APPLY_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.onEvent(SUBMIT_CREATE_MEET, this._eventHandlers.onSubmitForm);
        EventBus.onEvent(CREATE_MEETING_SUCCESS, this._eventHandlers.onCreateSuccess);
        EventBus.onEvent(INVALID_DATE_INPUT, this._eventHandlers.onInvalidDate);
        EventBus.onEvent(INVALID_TIME_INPUT, this._eventHandlers.onInvalidTime);
        EventBus.onEvent(BIG_FILE_SIZE, this._eventHandlers.onInvalidFile);
        EventBus.onEvent(INVALID_START_BIGGER_END, this._eventHandlers.onStartBiggerEnd);


    }

    unRegisterEvents() {
        EventBus.offEvent(USER_NOT_AUTHORIZED, this._eventHandlers.onNotAuthorized);
        EventBus.offEvent(CLOSE_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.offEvent(APPLY_TAGS_MODAL, this._eventHandlers.onSelectTags);
        EventBus.offEvent(SUBMIT_CREATE_MEET, this._eventHandlers.onSubmitForm);
        EventBus.offEvent(CREATE_MEETING_SUCCESS, this._eventHandlers.onCreateSuccess);
        EventBus.offEvent(INVALID_DATE_INPUT, this._eventHandlers.onInvalidDate);
        EventBus.offEvent(INVALID_TIME_INPUT, this._eventHandlers.onInvalidTime);
        EventBus.offEvent(BIG_FILE_SIZE, this._eventHandlers.onInvalidFile)
        EventBus.offEvent(INVALID_START_BIGGER_END, this._eventHandlers.onStartBiggerEnd);


    }

    _addEventListeners() {
        this._addSubmitFormEventListener();

        inputFileChangedEventListener();
        addTagsModalDialogEventListener();

        const city = document.getElementsByName('city')[0];
        const address = document.getElementsByName('address')[0];

        city.addEventListener('input', this._onChangeAddress.bind(this));
        address.addEventListener('input', this._onChangeAddress.bind(this));

        window.addEventListener('click', closeTagsModalDialog);
    }

    _addSubmitFormEventListener() {
        const form = document.forms[0];

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const fieldMap = new Map();

            fieldMap.set('name', document.getElementsByName('name')[0].value);
            fieldMap.set('meet-description', document.getElementsByName('meet-description')[0].value);
            fieldMap.set('city', document.getElementsByName('city')[0].value);
            fieldMap.set('address', document.getElementsByName('address')[0].value);
            fieldMap.set('seats', document.getElementsByName('seats')[0].valueAsNumber);


            const selectedTags = Array.from(document.getElementsByClassName('selectedTag'));
            fieldMap.set('meetingTags', selectedTags.map((tag) => {
                return tag.textContent;
            }));

            let dayValue = document.getElementsByName('start-day')[0].value;
            let monthValue = document.getElementsByName('start-month')[0].value;
            let yearValue = document.getElementsByName('start-year')[0].value;

            let hoursValue = document.getElementsByName('start-hours')[0].value;
            let minutesValue = document.getElementsByName('start-minutes')[0].value;
            if (yearValue.length && monthValue.length && dayValue.length) {
                if (!this.model.validator.isValidDate(dayValue, monthValue, yearValue)) {
                    EventBus.dispatchEvent(INVALID_DATE_INPUT, {prefix: 'start'});
                    return;
                }
                if (!this.model.validator.isValidTime(hoursValue, minutesValue)) {
                    EventBus.dispatchEvent(INVALID_TIME_INPUT, {prefix: 'start'});
                    return;
                }

                const start = newDate(yearValue, monthValue, dayValue, hoursValue, minutesValue);

                // fieldMap.set('start', `${yearValue} - ${monthValue} - ${dayValue} - ${hoursValue} - ${minutesValue}`);
                fieldMap.set('start', start.toISOString());
            }

            dayValue = document.getElementsByName('end-day')[0].value;
            monthValue = document.getElementsByName('end-month')[0].value;
            yearValue = document.getElementsByName('end-year')[0].value;
            hoursValue = document.getElementsByName('end-hours')[0].value;
            minutesValue = document.getElementsByName('end-minutes')[0].value;

            if (yearValue.length && monthValue.length && dayValue.length) {
                if (!this.model.validator.isValidDate(dayValue, monthValue, yearValue)) {
                    EventBus.dispatchEvent(INVALID_DATE_INPUT, {prefix: 'end'});
                    return;
                }
                if (!this.model.validator.isValidTime(hoursValue, minutesValue)) {
                    EventBus.dispatchEvent(INVALID_TIME_INPUT, {prefix: 'end'});
                    return;
                }

                const end = newDate(yearValue, monthValue, dayValue, hoursValue, minutesValue);
                // fieldMap.set('end', `${yearValue} - ${monthValue} - ${dayValue} - ${hoursValue} - ${minutesValue}`);
                fieldMap.set('end', end.toISOString());
            }

            const id = document.getElementsByName('id')[0].value;
            if (id !== undefined) {
                fieldMap.set('id', id);
            }

            const photos = document.getElementById('photoFileUploader').files;
            if (photos.length > 0) {
                let reader = new FileReader();
                reader.readAsDataURL(photos[0]);

                reader.onload = function() {
                    const r = reader.result;
                    fieldMap.set('photo', r);
                    const bodyFields = Object.fromEntries(deleteIf(fieldMap, (k, v) => v.length === 0).entries());
                    EventBus.dispatchEvent(SUBMIT_CREATE_MEET, bodyFields);
                };

                // formData.append(photos[0].name, photos[0]);
            } else {
                const bodyFields = Object.fromEntries(deleteIf(fieldMap, (k, v) => v.length === 0).entries());
                EventBus.dispatchEvent(SUBMIT_CREATE_MEET, bodyFields);
            }
            // formData.append('tags', JSON.stringify(selectedTags));

        });
    }

    _initDefaultDateTimeInputValues() {
        const arr =
            [['day', Date.prototype.getDate],
                ['month', Date.prototype.getMonth],
                ['year', Date.prototype.getFullYear],
                ['hours', Date.prototype.getHours],
                ['minutes', Date.prototype.getMinutes]];

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() + 1);
        arr.forEach((tok) => {
            let input = document.getElementsByName(`start-${tok[0]}`)[0];
            let val = tok[0] === 'month' ? tok[1].call(startDate) + 1 : tok[1].call(startDate);
            input.value = val;
        });

        const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // plus 3 hours;
        endDate.setMonth(endDate.getMonth() + 1);
        arr.forEach((tok) => {
            let input = document.getElementsByName(`end-${tok[0]}`)[0];
            let val = tok[0] === 'month' ? tok[1].call(endDate) + 1 : tok[1].call(endDate);
            input.value = val;
        });
    }

    _setUserGeolocation() {
        let input;

        if (this.model._user.userCity === null || this.model._user.userAddress === null) {
            this.model._user.getUserGeolocation();

            setTimeout(() => {
                input = document.getElementsByName('city')[0];
                input.value = this.model._user.userCity;

                input = document.getElementsByName('address')[0];
                input.value = this.model._user.userAddress;

                this.setYmapGeolocation.call(this, {
                    city: this.model._user.userCity,
                    address: this.model._user.userAddress
                });

                }, 3000);
        }

        input = document.getElementsByName('city')[0];
        input.value = this.model._user.userCity;

        input = document.getElementsByName('address')[0];
        input.value = this.model._user.userAddress;

        this.setYmapGeolocation.call(this, {
            city: this.model._user.userCity,
            address: this.model._user.userAddress
        });
    }

    setYmapGeolocation(geolocation) {
        const { city, address } = geolocation;

        const myMap = this.myMap;

        ymaps.geocode(`${city}, ${address}`, {
            /**
             * Опции запроса
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
             */
            // Если нужен только один результат, экономим трафик пользователей.
            results: 1
        }).then(function (res) {
            // Выбираем первый результат геокодирования.
            let firstGeoObject = res.geoObjects.get(0),
                // Координаты геообъекта.
                coords = firstGeoObject.geometry.getCoordinates(),
                // Область видимости геообъекта.
                bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            // Получаем строку с адресом и выводим в иконке геообъекта.
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

            // Добавляем первый найденный геообъект на карту.
            myMap.geoObjects.add(firstGeoObject);
            // Масштабируем карту на область видимости геообъекта.
            myMap.setBounds(bounds, {
                // Проверяем наличие тайлов на данном масштабе.
                checkZoomRange: true
            });

            /**
             * Все данные в виде javascript-объекта.
             */
            console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll());
            /**
             * Метаданные запроса и ответа геокодера.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderResponseMetaData.xml
             */
            console.log('Метаданные ответа геокодера: ', res.metaData);
            /**
             * Метаданные геокодера, возвращаемые для найденного объекта.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderMetaData.xml
             */
            console.log('Метаданные геокодера: ', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData'));
            /**
             * Точность ответа (precision) возвращается только для домов.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/precision.xml
             */
            console.log('precision', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.precision'));
            /**
             * Тип найденного объекта (kind).
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/kind.xml
             */
            console.log('Тип геообъекта: %s', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.kind'));
            console.log('Название объекта: %s', firstGeoObject.properties.get('name'));
            console.log('Описание объекта: %s', firstGeoObject.properties.get('description'));
            console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'));
            /**
             * Прямые методы для работы с результатами геокодирования.
             * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeocodeResult-docpage/#getAddressLine
             */
            console.log('\nГосударство: %s', firstGeoObject.getCountry());
            console.log('Населенный пункт: %s', firstGeoObject.getLocalities().join(', '));
            console.log('Адрес объекта: %s', firstGeoObject.getAddressLine());
            console.log('Наименование здания: %s', firstGeoObject.getPremise() || '-');
            console.log('Номер здания: %s', firstGeoObject.getPremiseNumber() || '-');

            /**
             * Если нужно добавить по найденным геокодером координатам метку со своими стилями и контентом балуна, создаем новую метку по координатам найденной и добавляем ее на карту вместо найденной.
             */
            /**
             var myPlacemark = new ymaps.Placemark(coords, {
                 iconContent: 'моя метка',
                balloonContent: 'Содержимое балуна <strong>моей метки</strong>'
                }, {
                preset: 'islands#violetStretchyIcon'
                });

             myMap.geoObjects.add(myPlacemark);
             */
        });

    }

    _onChangeAddress(evt) {
        evt.preventDefault();

        const city = document.getElementsByName('city')[0];
        const address = document.getElementsByName('address')[0];

        const myMap = this.myMap;
        myMap.geoObjects.removeAll();

        this.setYmapGeolocation.call(this, {
            city: city.value,
            address: address.value
        })
    }

    _showInvalidInputs() {
        const inputs = [...arguments];
        inputs.forEach((input) => {
            input.classList.add('invalid');
            setTimeout(() => {
                input.classList.toggle('invalid');
            }, 4000);
        })
    }

}

