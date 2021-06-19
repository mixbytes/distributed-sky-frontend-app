import BaseComponent from 'components/BaseComponent';
import template from 'components/BaseComponents/DropDownList/DropDownList.hbs';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';

export default class DropDownList extends BaseComponent {
    /**
     * Create a list
     * @constructor
     * @param {Object} context - list context
     * */
    constructor(context) {
        super(context);
        this._template = template;
    }
}
