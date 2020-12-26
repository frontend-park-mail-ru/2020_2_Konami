'use strict';

import appConfig from "../../config/appConfig.js";
import EventBus from "@/js/services/EventBus/EventBus";
import {REDIRECT} from "@/js/services/EventBus/EventTypes";

/**
 * Router приложения
 */

class Router {
    constructor() {
        this.routesMap = new Map();
        this.currentController = null;
    }

    /**
     * Регистрирует контроллер и его путь
     * @param {string} path - путь для контроллера
     * @param {any} controller - контроллер, обязан иметь метод activate
     */
    register(path, controller) {
        this.routesMap.set(path, controller);
    }

    /**
     * Запускает роутер
     */
    route() {
        window.addEventListener('popstate', () => { // срабатывает при вызове pushState
           const path = location.pathname;
           console.log(location.pathname);
           this._handlePath(path);
        });

        window.addEventListener('load', () => { // срабатывает при вызове pushState
            const path = location.pathname;
            this._handlePath(path);
        });

        window.addEventListener('click', (evt) => {
            const {target} = evt;
            if (target.dataset.section in appConfig) {
                evt.preventDefault();
                this.pushState(appConfig[target.dataset.section].href);
            }
        })
    }

    pushState(url = '/', state = {}) {
        if (url !== location.pathname) {
            history.pushState(state, document.title, url);
        } else {
            history.replaceState(state, document.title, url);
        }
        this._handlePath(url);
    }

    _handlePath(currentPath) {
        // Обрезает query параметры надо как-то это поправить чтоли
        currentPath = currentPath.split('?')[0];  // cut query params

        const controller = this.routesMap.get(currentPath);
        if (!controller) {
            // TODO(ERROR 404)
            alert('ERROR 404');
        }

        if (currentPath === '/search') {
            this._handleSearchControllerMixin(controller);
            return;
        }

        if (this.currentController) {
            this.currentController.deactivate();
        }

        this.currentController = controller;
        this.currentController.activate(new URLSearchParams(window.location.search));
    }

    redirectBack() {
        window.history.back();
    }

    redirectForward() {
        window.history.forward();
    }

    _handleSearchControllerMixin(controller) {
        if (this.currentController) {
            const searchInput = document.getElementsByClassName('search-block__search-input')[0];
            const searchResults = document.getElementsByClassName('search-block__offer');
            if (searchInput.value === '' && searchResults.length === 0) {
                this.redirectBack();
            }

            const prevController = this.currentController;
            this.currentController = controller;  // берем контролер поиска
            this.currentController.activate(prevController);  // прокидываем в него предыдущий контроллер для его дальнейшей деактивации
        } else {
            EventBus.dispatchEvent(REDIRECT, {url: '/meetings'});
        }
    }

}

export default new Router();
