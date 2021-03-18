import AccountAddFormItems from 'consts/AccountAddFormItems';
import BaseComponent from 'components/BaseComponent';
import Events from 'consts/Events';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/standardButton/StandardButton';
import template from 'components/AccountAddForm/AccountAddForm.hbs';
import TextInput from 'components/BaseComponents/textInput/TextInput';

export default class AccountAddForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        for (const i in AccountAddFormItems) {
            if (Object.prototype.hasOwnProperty.call(AccountAddFormItems, i)) {
                this._context.input.push((new TextInput(AccountAddFormItems[i])).render());
            }
        }

        this._context.RegisterPath = Routes.AccountAdd;
        this._context.RegisterEvent = Events.ChangePath;

        this._context.StandardButton = (new StandardButton({
            buttonName: 'Добавить аккаунт',
            event: Events.AccountAddSubmit,
        })).render();
    }
}
