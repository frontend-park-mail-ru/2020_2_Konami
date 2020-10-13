/**
 * EventBus
 */

class EventBus {

    /**
     * listeners[evt] = Array of callbacks
     */
    listeners = {}

    constructor() {
        this.listeners = {}
    }


    /**
     * Подписка на событие
     * @param {string} evt - название событие
     * @param {function} callback - колбэк события
     */
    onEvent(evt, callback) {
        this.listeners[evt].push(callback);
    }

    /**
     * Подписка на событие
     * @param {string} evt - название событие
     * @param {function} callback - колбэк события
     */
    offEvent(evt, callback) {
        this.listeners[evt] = this.listeners[evt]
            .filter((clb) => { return clb !== callback} );
    }

    /**
     * Вызывает обработчиков события
     * @param {string} evt - имя события
     * @param {Object?} data - контекст события
     */
    dispatchEvent(evt, data) {
        this.listeners[evt].forEach((callback) => {
            callback(data);
        })
    }
}

export default new EventBus();

