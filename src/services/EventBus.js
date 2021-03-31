/**
 * EventBus singleton
 * @class
 */
class EventBus {
    /**
     * Create one instance of EventBus
     * @constructor
     */
    constructor() {
        this._listeners = {};
    }

    /**
     * Method that adds handler for the event
     * @param {string} event
     * @param {function} callback
     */
    on(event, callback) {
        this._listeners[event] = this._listeners[event] ? this._listeners[event] : [];
        this._listeners[event].push(callback);
    }

    /**
     * Method that removes handler for the event
     * @param {string} event
     * @param {function} callback
     */
    off(event, callback) {
        if (!this._listeners[event]) {
            return;
        }
        this._listeners[event] = this._listeners[event].filter((listener) => {
            return listener !== callback;
        });
    }

    /**
     * Method that emits handler of the event
     * @param {string} event
     * @param {Object} eventData
     */
    emit(event, eventData = {}) {
        this._listeners[event].forEach((listener) => {
            listener(eventData);
        });
    }
}

export default new EventBus();
