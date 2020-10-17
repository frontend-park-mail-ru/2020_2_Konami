'use strict';

import appConfig from "../../config/appConfig.js";

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
        const controller = this.routesMap.get(currentPath);
        if (!controller) {
            // TODO(ERROR 404)
            alert('ERROR 404');
        }

        if (this.currentController) {
            this.currentController.deactivate();
        }

        this.currentController = controller;
        this.currentController.activate();

    }

    redirectBack() {
        window.history.back();
    }

}

export default new Router();