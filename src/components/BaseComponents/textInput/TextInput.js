import BaseComponent from 'components/BaseComponent';
import template from 'components/BaseComponents/textInput/TextInput.hbs';

export default class TextInput extends BaseComponent {
    /**
     * Create a text input
     * @constructor
     * @param {Object} context - text input context
     * */
    constructor(context) {
        super(context);
        this._template = template;
    }
}