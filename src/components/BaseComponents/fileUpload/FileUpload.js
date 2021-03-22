import BaseComponent from 'components/BaseComponent';
import template from 'components/BaseComponents/fileUpload/FileUpload.hbs';

export default class FileUpload extends BaseComponent {
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
