import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import MapController from 'controllers/MapController';
import template from 'views/MapUsageView/MapUsageView.hbs';
import MapUsageForm from 'components/MapUsageForm/MapUsageForm';

export default class MapUsageView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._rootAddFormData = {
            rootCoords: '',
        };
        this._BCController = new BCController();
        this._MapController = new MapController();
    }

    async show(routeData) {
        this._MapUsageForm = new MapUsageForm();

        this._onSubmitHandler = this.onSubmit.bind(this);
        this._onFormRendered = this.onFormRendered.bind(this);

        EventBus.on(Events.FormRendered, this._onFormRendered);
        EventBus.on(Events.MapTouched, this._onMapTouched);

        const data = {
            // Create buttons, making place for maps
            MapUsageForm: this._MapUsageForm.render(),
        };

        await super.show(this._template(data));

        EventBus.emit(Events.FormRendered);
    }

    async onFormRendered(data = {}) {
        // Rendering maps after building the page
        this.myMap = this._MapUsageForm.drawMap();
        await this._MapController.initMap(this.myMap);
    }

    async onReset() {
        console.log('Input data was cleaned');
    }

    async onSubmit() {
        await this._BCController.rootAdd(
            this._registerPilotFormData.rootCoords,
        );
    }
}
