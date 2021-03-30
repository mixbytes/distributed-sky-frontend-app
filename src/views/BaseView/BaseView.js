import template from 'views/BaseView/BaseView.hbs';

export default class BaseView {
    /**
     * Constructor of the base view
     * @constructor
     * @param {string} title
     */
    constructor(title = 'Distributed Sky') {
        document.title = title;
        this._root = document.querySelector('.application');
        this._template = template;
        this._context = {};
    }

    /**
     * Method that shows page
     * @param {string} contentTemplate - rendered template of page
     */
    async show(contentTemplate) {
        this._context.Content = contentTemplate;
        this._root.innerHTML = template(this._context);
    }

    /**
     * Method that hides page content
     */
    hide() {
        document.querySelector('.content').innerHTML = '';
    }
}
