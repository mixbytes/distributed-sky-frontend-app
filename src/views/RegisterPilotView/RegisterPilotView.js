import BaseView from 'views/BaseView/BaseView';
import template from 'views/RegisterPilotView/RegisterPilotView.hbs';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import RegisterPilotForm from 'components/RegisterPilotForm/RegisterPilotForm';

export default class RegisterPilotView extends BaseView {
    constructor(title = 'Register Pilot') {
        super(title);
        this._template = template;
        this._registerPilotFormData = {
            accountAddress: '',
            metadataIPFSHash: '',
        };
        this._BCController = new BCController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputAddress, this._onUpdateFieldHandler);
        EventBus.on(Events.InputHash, this._onUpdateFieldHandler);
        EventBus.on(Events.RegisterPilotSubmit, this._onSubmitHandler);

        this._registerPilotForm = new RegisterPilotForm();
        const data = {
            RegisterPilotForm: this._registerPilotForm.render(),
        };
        await super.show(this._template(data));
    }

    onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputAddress: {
                this._registerPilotFormData.accountAddress = data.value;
                break;
            }
            case Events.InputHash: {
                this._registerPilotFormData.metadataIPFSHash = data.value;
                break;
            }
            default: {
                break;
            }
        }
    }

    async onSubmit() {
        const result = await this._BCController.registerPilot(
            this._registerPilotFormData.accountAddress,
            this._registerPilotFormData.metadataIPFSHash,
        );

        const resultBlock = document.querySelector('.result-block');
        resultBlock.innerHTML = result;
        resultBlock.classList.remove('result-block-display-none');
    }
}
