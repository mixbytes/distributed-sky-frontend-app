import BaseComponent from 'components/BaseComponent';
import Events from 'consts/Events';
import ImageInput from 'components/BaseComponents/ImageInput/ImageInput';
import template from 'components/UavAddForm/UavAddForm.hbs';
import TextInput from 'components/BaseComponents/TextInput/TextInput';
import Routes from 'consts/Routes';
import UavAddFormItems from 'consts/UavAddFormItems';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';

export default class UavAddForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        this._context.RegisterPath = Routes.UavAdd;
        this._context.RegisterEvent = Events.ChangePath;

        for (const i in UavAddFormItems) {
            if (Object.prototype.hasOwnProperty.call(UavAddFormItems, i)) {
                this._context.input.push((new TextInput(UavAddFormItems[i])).render());
            }
        }

        this._context.StandardButton = (new StandardButton({
            buttonName: 'Submit new UAV',
            event: Events.UavAdd,
        })).render();
    }
}
