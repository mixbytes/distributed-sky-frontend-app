import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import MapController from 'controllers/MapController';
import template from 'views/UseMapView/UseMapView.hbs';
import UseMapForm from 'components/UseMapForm/UseMapForm';
import MapComponent from 'components/MapComponent/MapComponent';


export default class UseMapView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._rootAddFormData = {
            rootCoords: '',
        };
        this._BCController = new BCController();
        // this._MapController = new MapController();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.InputRoot, this._onUpdateFieldHandler);
        EventBus.on(Events.RegisterPilotSubmit, this._onSubmitHandler);
        // super.hide_root();
        this._useMapForm = new UseMapForm();
        this._mapComponent = new MapComponent();

        const data = {
            UseMapForm: this._useMapForm.render(),
            MapData: this._mapComponent.render(),
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