import BaseComponent from 'components/BaseComponent';
import template from 'components/BaseComponents/standardButton/StandardButton.hbs';

export default class StandardButton extends BaseComponent {
    /**
     * Create a button
     * @constructor
     * @param {Object} context - button context
     * */
    constructor(context) {
        super(context);
        this._template = template;
    }
}