import BaseComponent from 'components/BaseComponent';
import template from 'components/BaseComponents/ImageInput/ImageInput.hbs';

export default class ImageInput extends BaseComponent {
    /**
     * Create a file input
     * @constructor
     * @param {Object} context
     * */
    constructor(context = {}) {
        super(context);
        this._template = template;
    }
}
