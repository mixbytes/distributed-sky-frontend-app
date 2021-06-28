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
            coords: '',
            delta: '0.1',
        };
        this._rootRequestFormData = {
            index: '',
        };
        this._BCController = new BCController();
        this._MapController = new MapController();
    }
    // TODO merge Zone addition and root addition to one page with switch.
    async show(routeData) {
        this._ZoneAdditionForm = new ZoneAdditionForm();

        this._onSubmitHandler = this.onSubmit.bind(this);
        // this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onRootRequest = this.onRootRequest.bind(this);
        this._onFormRendered = this.onFormRendered.bind(this);
        // this._onMapOptionSelectHandler = this.onMapOptionSelect.bind(this);

        // EventBus.on(Events.SelectMapOption, this._onMapOptionSelectHandler);
        EventBus.on(Events.FormRendered, this._onFormRendered);
        // EventBus.on(Events.InputDelta, this._onUpdateFieldHandler);
        EventBus.on(Events.RootRequest, this._onRootRequest);
        EventBus.on(Events.RootAdditionSubmit, this._onSubmitHandler);

        const data = {
            ZoneAdditionForm: this._ZoneAdditionForm.render(),
        };

        await super.show(this._template(data));

        EventBus.emit(Events.FormRendered);
    }

    async onFormRendered(data = {}) {
        // Rendering maps after building the page
        this.myMap = this._ZoneAdditionForm.drawMap();
        await this._MapController.initMap(this.myMap, false);
    }

    // onMapOptionSelect(data = {}) {
    //     console.log('HIIIIIII')
    // }

    async onRootRequest(data = {}) {
        this._rootRequestFormData.index = data;
        await this._BCController.rootRequest(this._rootRequestFormData.index);
    }

    // onUpdateField(data = {}) {
    //     switch (data.event) {
    //         case Events.InputDelta: {
    //             this._rootAddFormData.delta = data.value;
    //             break;
    //         }
    //         default: {
    //             break;
    //         }
    //     }
    // }

    async onSubmit() {
        await this._BCController.zoneAdd(
            this._zoneAddFormData.coords,
            this._zoneAddFormData.delta,
        );
    }
}
