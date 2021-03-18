import BaseView from 'views/BaseView/BaseView';
import Menu from 'components/Menu/Menu';
import template from 'views/MainView/MainView.hbs';

export default class MainView extends BaseView {
    /**
     * Constructor of the main page view
     * @constructor
     * @param {string} title - title of the main page
     */
    constructor(title = 'DistributedSky') {
        super(title);
        this._template = template;
    }

    /**
     * Method that shows main page
     */
    async show() {
        this._menu = new Menu();

        const data = {
            Menu: this._menu.render(),
        };

        await super.show(this._template(data));
    }
}
