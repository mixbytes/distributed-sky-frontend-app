import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import ExtractFromStorageForm from 'components/ExtractFromStorageForm/ExtractFromStorageForm';
import template from 'views/ExtractFromStorageView/ExtractFromStorageView.hbs';

export default class ExtractFromStorageView extends BaseView {
    constructor(title = 'Extract from storage') {
        super(title);
        this._template = template;
        this._extractFromStorageFormData = {
            accountAddress: '',
        };

        this._BCController = new BCController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputAddress, this._onUpdateFieldHandler);
        EventBus.on(Events.ExtractFromStorageSubmit, this._onSubmitHandler);

        this._extractFromStorageForm = new ExtractFromStorageForm();
        const data = {
            ExtractFromStorageForm: this._extractFromStorageForm.render(),
        };

        await super.show(this._template(data));
    }

    onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputAddress: {
                this._extractFromStorageFormData.accountAddress = data.value;
                break;
            }
            default: {
                break;
            }
        }
    }

    async onSubmit() {
        const result = await this._BCController.extractAccountIPFSHashFromStorage(
            this._extractFromStorageFormData.accountAddress,
        );

        const resultBlock = document.querySelector('.result-block');
        if (result.length !== 0) {
            resultBlock.innerHTML = `Extracted account metadata IPFS hash: ${result}`;
        } else {
            resultBlock.innerHTML = 'The account metadata IPFS hash is missing.';
        }
        resultBlock.classList.remove('result-block-display-none');
    }
}
