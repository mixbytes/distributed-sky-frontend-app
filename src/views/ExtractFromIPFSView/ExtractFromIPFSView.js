import BaseView from 'views/BaseView/BaseView';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import ExtractFromIPFSForm from 'components/ExtractFromIPFSForm/ExtractFromIPFSForm';
import IPFSController from 'controllers/IPFSController';
import template from 'views/ExtractFromIPFSView/ExtractFromIPFSView.hbs';

export default class ExtractFromIPFSView extends BaseView {
    constructor(title = 'Extract from IPFS') {
        super(title);
        this._template = template;
        this._extractFromIPFSFormData = {
            metadataIPFSHash: '',
        };

        this._ipfsController = new IPFSController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputHash, this._onUpdateFieldHandler);
        EventBus.on(Events.ExtractFromIPFSSubmit, this._onSubmitHandler);

        this._extractFromIPFSForm = new ExtractFromIPFSForm();
        const data = {
            ExtractFromIPFSForm: this._extractFromIPFSForm.render(),
        };

        await super.show(this._template(data));
    }

    onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputHash: {
                this._extractFromIPFSFormData.metadataIPFSHash = data.value;
                break;
            }
            default: {
                break;
            }
        }
    }

    async onSubmit() {
        const result = await this._ipfsController.extractFromIPFS(
            this._extractFromIPFSFormData.metadataIPFSHash,
        );

        const resultBlock = document.querySelector('.result-block');
        if (result.length !== 0) {
            const image = document.getElementById('credentials');
            const blob = new Blob([result], {'type': 'image/png'});
            const url = URL.createObjectURL(blob);
            image.setAttribute('src', url);
        } else {
            resultBlock.innerHTML = 'The content is missing.';
        }
        resultBlock.classList.remove('result-block-display-none');
    }
}
