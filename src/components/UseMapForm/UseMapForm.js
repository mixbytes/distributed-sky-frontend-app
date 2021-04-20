import Routes from 'consts/Routes';
import Events from 'consts/Events';
import TextInput from 'components/BaseComponents/TextInput/TextInput';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/UseMapForm/UseMapForm.hbs';
import BaseComponent from 'components/BaseComponent';
import UseMapFormItems from 'consts/UseMapFormItems';

export default class UseMapForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        for (const i in UseMapFormItems) {
            if (Object.prototype.hasOwnProperty.call(UseMapFormItems, i)) {
                this._context.input.push((new TextInput(UseMapFormItems[i])).render());
            }
        }

        this._context.RegisterPath = Routes.UseMap;
        this._context.RegisterEvent = Events.ChangePath;

        this._context.StandardButton = (new StandardButton({
            buttonName: 'Set root here',
            event: Events.InputRoot,
        })).render();
    }
}