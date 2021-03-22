import BaseComponent from 'components/BaseComponent';
import template from 'components/AccountAddForm/AccountAddForm.hbs';
import TextInput from 'components/BaseComponents/textInput/TextInput';
import Routes from 'consts/Routes';
import Events from 'consts/Events';
import RegisterPilotFormItems from 'consts/RegisterPilotFormItems';
import StandardButton from 'components/BaseComponents/standardButton/StandardButton';

export default class RegisterPilotForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        for (const i in RegisterPilotFormItems) {
            if (Object.prototype.hasOwnProperty.call(RegisterPilotFormItems, i)) {
                this._context.input.push((new TextInput(RegisterPilotFormItems[i])).render());
            }
        }

        this._context.RegisterPath = Routes.RegisterPilot;
        this._context.RegisterEvent = Events.ChangePath;

        this._context.StandardButton = (new StandardButton({
            buttonName: 'Register pilot',
            event: Events.RegisterPilotSubmit,
        })).render();
    }
}
