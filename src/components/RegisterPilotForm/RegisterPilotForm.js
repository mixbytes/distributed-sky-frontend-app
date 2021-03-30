import BaseComponent from 'components/BaseComponent';
import Events from 'consts/Events';
import ImageInput from 'components/BaseComponents/ImageInput/ImageInput';
import template from 'components/RegisterPilotForm/RegisterPilotForm.hbs';
import TextInput from 'components/BaseComponents/TextInput/TextInput';
import Routes from 'consts/Routes';
import RegisterPilotFormItems from 'consts/RegisterPilotFormItems';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';

export default class RegisterPilotForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        for (const i in RegisterPilotFormItems) {
            if (Object.prototype.hasOwnProperty.call(RegisterPilotFormItems, i)) {
                if (i === 'licensePNG') {
                    this._context.input.push((new ImageInput(RegisterPilotFormItems[i]).render()));
                    continue;
                }
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
