import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import IPFSController from 'controllers/IPFSController';
import UseMapForm from 'components/UseMapForm/UseMapForm';
import template from 'views/UseMapView/UseMapView.hbs';

export default class UseMapView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._rootAddFormData = {
            rootCoords: '',
        };
        this._BCController = new BCController();
        this._ipfsController = new IPFSController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputRoot, this._onUpdateFieldHandler);
        EventBus.on(Events.RegisterPilotSubmit, this._onSubmitHandler);

        this._useMapForm = new UseMapForm();
        const data = {
            UseMapForm: this._useMapForm.render(),
        };
        await super.show(this._template(data));
    }

    async onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputRoot:
                {
                    this._rootAddFormData.rootCoords = data.value;
                    break;
                }
            default:
                {
                    break;
                }
        }
    }

    async onSubmit() {
        await this._BCController.rootAdd(
            this._registerPilotFormData.rootCoords,
        );
    }
}