import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import ExtractFromStorageForm from 'components/ExtractFromStorageForm/ExtractFromStorageForm';
import IPFSController from 'controllers/IPFSController';
import template from 'views/ExtractFromStorageView/ExtractFromStorageView.hbs';

export default class ExtractFromStorageView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._extractFromStorageFormData = {
            accountAddress: '',
        };

        this._BCController = new BCController();
        this._ipfsController = new IPFSController();
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
        const ipfsHash = await this._BCController.extractAccountIPFSHashFromStorage(
            this._extractFromStorageFormData.accountAddress,
        );

        const result = await this._ipfsController.extractFromIPFS(ipfsHash).catch(() => {
            return 0;
        });

        if (result && result.length !== 0) {
            const resultBlock = document.querySelector('.result-block-image');
            const image = document.getElementById('credentials');
            const blob = new Blob([result], {'type': 'image/png'});
            const url = URL.createObjectURL(blob);
            image.setAttribute('src', url);
            resultBlock.classList.remove('result-block-image-display-none');
        } else {
            const resultBlock = document.querySelector('.result-block');
            resultBlock.innerHTML = 'The content is missing.';
            resultBlock.classList.remove('result-block-display-none');
        }
    }
}
