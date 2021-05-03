import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import MapController from 'controllers/MapController';
import template from 'views/UseMapView/UseMapView.hbs';
import UseMapForm from 'components/UseMapForm/UseMapForm';


export default class UseMapView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._rootAddFormData = {
            rootCoords: '',
        };
        this._BCController = new BCController();
        this._MapController = new MapController();
        this._useMapForm = new UseMapForm();
    }

    async show(routeData) {
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onSubmitHandler = this.onSubmit.bind(this);
        this._onFormRendered = this.onFormRendered.bind(this);
        this._onMapTouched = this.onMapTouched.bind(this);

        EventBus.on(Events.InputRoot, this._onUpdateFieldHandler);
        EventBus.on(Events.FormRendered, this._onFormRendered);
        EventBus.on(Events.MapTouched, this._onMapTouched);
        
        const data = {
            UseMapForm: this._useMapForm.render(),
        };
        
        await super.show(this._template(data));
    }
    
    async onFormRendered(data = {}) {
        this._useMapForm.draw_map();
    }

    async onMapTouched(data = {}) {
        // this._useMapForm.onMapClick(data);

        // console.log(data.latlng);
    }
    
    async onReset(){
        console.log("Input data was cleaned");
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