import BaseComponent from 'components/BaseComponent';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import L from 'leaflet';
import 'leaflet-draw';
import MapUsageFormItems from 'consts/MapUsageFormItems';
import Parser from 'utils/Parser';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/ZoneAdditionForm/ZoneAdditionForm.hbs';
import * as wasm from 'wasm_indexes';

export default class ZoneAdditionForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        this._context.RegisterPath = Routes.ZomeAddition;
        this._context.RegisterEvent = Events.ChangePath;

        this._context.SubmitRootButton = (new StandardButton({
            buttonName: 'Add Zone',
            event: Events.ZoneAdditionSubmit,
        })).render();
    }

    drawMap() {
        // If map already exists, replace w new one
        const container = L.DomUtil.get('map');
        if (container != null) {
            container._leaflet_id = null;
        }

        // Setting default location to Moscow
        const myMap = L.map('map', {closePopupOnClick: false}).setView([55.751, 37.618], 10);
        
        const drawnItems = L.featureGroup().addTo(myMap);
        
        myMap.addControl(new L.Control.Draw({
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                },
                marker: false,
                polygon: false,
                circlemarker: false,
                circle: false,
                polyline: false,
            },
        }));
        
        var popup = L.popup();
        
        function onMapClick(e) {
            let lat_fix = Parser.parseToCoord(Parser.trimTo(parseFloat(e.latlng.lat), 5));
            let lon_fix = Parser.parseToCoord(Parser.trimTo(parseFloat(e.latlng.lon), 5));
            // 2097202
            
            let index = wasm.index_generate(lat_fix, lon_fix);
            EventBus.emit(Events.RootRequest, index);
            popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(myMap);
        }
        
        myMap.on('click', onMapClick);
        
        return myMap;
    }
}
