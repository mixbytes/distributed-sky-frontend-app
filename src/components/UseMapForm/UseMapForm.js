import Routes from 'consts/Routes';
import Events from 'consts/Events';
import TextInput from 'components/BaseComponents/TextInput/TextInput';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/UseMapForm/UseMapForm.hbs';
import BaseComponent from 'components/BaseComponent';
import UseMapFormItems from 'consts/UseMapFormItems';
import L from 'leaflet';

export default class UseMapForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        this._context.RegisterPath = Routes.UseMap;
        this._context.RegisterEvent = Events.ChangePath;

        let elementMapId = document.createElement("div");

        elementMapId.id = "mapid";
        elementMapId.style = "width: 100%; height: 100%;";
        elementMapId.tabindex = "1";
        this._context.MapForm = elementMapId.context;
        // document.append(elementMapId);
        }
}