import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import IPFSController from 'controllers/IPFSController';
import RegisterPilotForm from 'components/RegisterPilotForm/RegisterPilotForm';
import template from 'views/RegisterPilotView/RegisterPilotView.hbs';

export default class RegisterPilotView extends BaseView {
    constructor(title = 'Register Pilot') {
        super(title);
        this._template = template;
        this._registerPilotFormData = {
            accountAddress: '',
            metadataIPFSHash: '',
        };
        this._BCController = new BCController();
        this._ipfsController = new IPFSController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputAddress, this._onUpdateFieldHandler);
        EventBus.on(Events.UploadImage, this._onUpdateFieldHandler);
        EventBus.on(Events.RegisterPilotSubmit, this._onSubmitHandler);

        this._registerPilotForm = new RegisterPilotForm();
        const data = {
            RegisterPilotForm: this._registerPilotForm.render(),
        };
        await super.show(this._template(data));
    }

    async onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputAddress: {
                this._registerPilotFormData.accountAddress = data.value;
                break;
            }
            case Events.UploadImage: {
                if (data.target.files[0].type.match('image.*')) {
                    this._registerPilotFormData.metadataIPFSHash = await this._ipfsController.uploadToIPFS(data.target.files[0]);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    async onSubmit() {
        await this._BCController.registerPilot(
            this._registerPilotFormData.accountAddress,
            this._registerPilotFormData.metadataIPFSHash,
        );
    }
}
