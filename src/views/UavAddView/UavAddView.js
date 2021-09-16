import BaseView from 'views/BaseView/BaseView';
import BCController from 'controllers/BCController';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import UavAddForm from 'components/UavAddForm/UavAddForm';
import template from 'views/UavAddView/UavAddView.hbs';

export default class UavAddView extends BaseView {
    constructor(title = 'Distributed Sky') {
        super(title);
        this._template = template;

        this._BCController = new BCController();
        // this._ipfsController = new IPFSController();
    }

    async show(routeData) {
        this._onSubmitHandler = this.onSubmit.bind(this);

        EventBus.on(Events.UavAdd, this._onSubmitHandler);

        this._uavAddForm = new UavAddForm();
        const data = {
            UavAddForm: this._uavAddForm.render(),
        };

        await super.show(this._template(data));
    }

    async onSubmit() {
        const ipfsHash = await this._BCController.uavAdd(
            // this._extractFromStorageFormData.accountAddress,
        );
    }
}
