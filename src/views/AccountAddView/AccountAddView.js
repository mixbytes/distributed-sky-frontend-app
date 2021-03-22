import AccountAddForm from 'components/AccountAddForm/AccountAddForm';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import template from 'views/AccountAddView/AccountAddView.hbs';

export default class AccountAddView extends BaseView {
    constructor(title = 'Account Add') {
        super(title);
        this._template = template;
        this._accountAddFormData = {
            accountAddress: '',
            metadataIPFSHash: '',
            role: '',
        };
        this._BCController = new BCController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputAddress, this._onUpdateFieldHandler);
        EventBus.on(Events.InputHash, this._onUpdateFieldHandler);
        EventBus.on(Events.InputRole, this._onUpdateFieldHandler);
        EventBus.on(Events.AccountAddSubmit, this._onSubmitHandler);

        this._accountAddForm = new AccountAddForm();
        const data = {
            AccountAddForm: this._accountAddForm.render(),
        };
        await super.show(this._template(data));
    }

    onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputAddress: {
                this._accountAddFormData.accountAddress = data.value;
                break;
            }
            case Events.InputHash: {
                this._accountAddFormData.metadataIPFSHash = data.value;
                break;
            }
            case Events.InputRole: {
                this._accountAddFormData.role = data.value;
                break;
            }
            default: {
                break;
            }
        }
    }

    async onSubmit() {
        const result = await this._BCController.accountAdd(
            this._accountAddFormData.accountAddress,
            this._accountAddFormData.metadataIPFSHash,
            this._accountAddFormData.role,
        );

        const resultBlock = document.querySelector('.result-block');
        resultBlock.innerHTML = result;
        resultBlock.classList.remove('result-block-display-none');
    }
}