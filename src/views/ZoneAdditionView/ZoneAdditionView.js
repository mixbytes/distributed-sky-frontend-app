import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import MapController from 'controllers/MapController';
import ZoneAdditionForm from 'components/ZoneAdditionForm/ZoneAdditionForm';
import template from 'views/ZoneAdditionView/ZoneAdditionView.hbs';

export default class ZoneAdditionView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._zoneAddFormData = {
            zones: '',
        };
        this._rootRequestFormData = {
            index: '',
        };
        this._BCController = new BCController();
        this._MapController = new MapController();

        this._busy = false;
    }

    // TODO merge Zone addition and root addition to one page with a switch.
    async show(routeData) {
        this._ZoneAdditionForm = new ZoneAdditionForm();

        this._onSubmitHandler = this.onSubmit.bind(this);
        this._onRootRequest = this.onRootRequest.bind(this);
        this._onRootShow = this.onRootShow.bind(this);
        this._onFormRendered = this.onFormRendered.bind(this);
        this._onZoneAdd = this.onZoneAdd.bind(this);

        EventBus.on(Events.FormRendered, this._onFormRendered);
        EventBus.on(Events.RootRequest, this._onRootRequest);
        EventBus.on(Events.RootShow, this._onRootShow);
        EventBus.on(Events.ZoneAdditionSubmit, this._onSubmitHandler);
        EventBus.on(Events.ZoneAddition, this._onZoneAdd);

        const data = {
            ZoneAdditionForm: this._ZoneAdditionForm.render(),
        };

        await super.show(this._template(data));

        EventBus.emit(Events.FormRendered);
    }

    async onFormRendered(data = {}) {
        // Rendering maps after building the page
        this.myMap = this._ZoneAdditionForm.drawMap();
        await this._MapController.initZoneMap(this.myMap);
    }

    async onRootRequest(data = {}) {
        if (!this._busy) {
            this._busy = true;
            this._rootRequestFormData.lat = data[0];
            this._rootRequestFormData.lon = data[1];
            await this._BCController.rootRequest(this._rootRequestFormData.lat, this._rootRequestFormData.lon);
            this._busy = false;
        }
    }

    onRootShow(data = {}) {
        this._ZoneAdditionForm.drawRoot(data);
        // await this._BCController.rootRequest(this._rootRequestFormData.lat, this._rootRequestFormData.lon);
    }

    onZoneAdd(data = {}) {
        this._zoneAddFormData.zones = data;
    }

    async onSubmit() {
        await this._BCController.zoneAdd(
            this._zoneAddFormData.zones,
            this._rootRequestFormData.index,
        );
    }
}
