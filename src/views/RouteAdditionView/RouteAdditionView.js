import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import MapController from 'controllers/MapController';
import RouteAdditionForm from 'components/RouteAdditionForm/RouteAdditionForm';
import template from 'views/RouteAdditionView/RouteAdditionView.hbs';

export default class RouteAdditionView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._rootRequestFormData = {
            lat: '',
            lon: '',
        };
        this._routeAddFormData = {
            index: '',
            polyline: '',
        };
        this._BCController = new BCController();
        this._MapController = new MapController();

        this._busy = false;
    }

    // TODO merge Zone addition and root addition to one page with a switch.
    async show(routeData) {
        this._RouteAdditionForm = new RouteAdditionForm();

        this._onSubmitHandler = this.onSubmit.bind(this);
        this._onRootRequest = this.onRootRequest.bind(this);
        this._onRootShow = this.onRootShow.bind(this);
        this._onFormRendered = this.onFormRendered.bind(this);
        this._onRouteAdd = this.onRouteAdd.bind(this);

        EventBus.on(Events.FormRendered, this._onFormRendered);
        EventBus.on(Events.RootRequest, this._onRootRequest);
        EventBus.on(Events.RootShow, this._onRootShow);
        EventBus.on(Events.RouteAdditionSubmit, this._onSubmitHandler);
        EventBus.on(Events.RouteAddition, this._onRouteAdd);

        const data = {
            RouteAdditionForm: this._RouteAdditionForm.render(),
        };

        await super.show(this._template(data));

        EventBus.emit(Events.FormRendered);
    }

    async onFormRendered(data = {}) {
        // Rendering maps after building the page
        this.myMap = this._RouteAdditionForm.drawMap();
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
        this._routeAddFormData.index = data.id;
        this._RouteAdditionForm.drawRoot(data);
    }

    onRouteAdd(data = {}) {
        this._routeAddFormData.polyline = data;
    }

    async onSubmit() {
        await this._BCController.routeAdd(
            this._routeAddFormData.polyline,
            this._routeAddFormData.index,
        );
    }
}
