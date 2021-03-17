export default class BaseComponent {
    /**
     * Create a component
     * @constructor
     * @param {Object} context
     */
    constructor(context) {
        this._context = context;
    }

    /**
     * Render a component
     * @return {string}
     */
    render() {
        return this._template(this._context);
    }

    off() {
    }
}
