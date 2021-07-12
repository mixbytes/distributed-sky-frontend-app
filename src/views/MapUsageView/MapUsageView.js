import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import MapController from 'controllers/MapController';
import MapUsageForm from 'components/MapUsageForm/MapUsageForm';
import template from 'views/MapUsageView/MapUsageView.hbs';

export default class MapUsageView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;
        this._rootAddFormData = {
            coords: '',
            // TODO change this mock to delta calculations
            delta: '0.01',
        };
        this._BCController = new BCController();
        this._MapController = new MapController();
    }
    // TODO merge Zone addition and root addition to one page with switch.
    async show(routeData) {
        this._MapUsageForm = new MapUsageForm();

        this._onSubmitHandler = this.onSubmit.bind(this);
        this._onUpdateFieldHandler = this.onUpdateField.bind(this);
        this._onRootAddition = this.onRootAddition.bind(this);
        this._onFormRendered = this.onFormRendered.bind(this);
        // this._onMapOptionSelectHandler = this.onMapOptionSelect.bind(this);

        // EventBus.on(Events.SelectMapOption, this._onMapOptionSelectHandler);
        EventBus.on(Events.FormRendered, this._onFormRendered);
        EventBus.on(Events.InputDelta, this._onUpdateFieldHandler);
        EventBus.on(Events.RootAddition, this._onRootAddition);
        EventBus.on(Events.RootAdditionSubmit, this._onSubmitHandler);

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
        await this._MapController.initRootMap(this.myMap);
    }


    // onMapOptionSelect(data = {}) {
    //     console.log('HIIIIIII')
    // }

    onRootAddition(data = {}) {
        this._rootAddFormData.coords = data;
    }

    onUpdateField(data = {}) {
        switch (data.event) {
            case Events.InputDelta: {
                this._rootAddFormData.delta = data.value;
                break;
            }
            default: {
                break;
            }
        }
    }

    async onSubmit() {
        await this._BCController.rootAdd(
            this._rootAddFormData.coords,
            this._rootAddFormData.delta,
        );
    }
}
