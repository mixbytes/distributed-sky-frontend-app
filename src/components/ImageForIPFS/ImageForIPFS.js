import BaseComponent from 'components/BaseComponent';
import template from 'components/ImageForIPFS/ImageForIPFS.hbs';

/**
 * Image input component
 * @class
 */
export default class ImageForIPFS extends BaseComponent {
    /**
     * Create an image input
     * @constructor
     * @param {Object} context - image input context
     * */
    constructor(context) {
        super(context);
        this._template = template;
    }
}
