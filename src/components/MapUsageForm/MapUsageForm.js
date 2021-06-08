import BaseComponent from 'components/BaseComponent';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import L from 'leaflet';
import 'leaflet-draw';
import MapUsageFormItems from 'consts/MapUsageFormItems';
import Parser from 'utils/Parser';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/MapUsageForm/MapUsageForm.hbs';
import TextInput from 'components/BaseComponents/TextInput/TextInput';

export default class MapUsageForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        this._context.RegisterPath = Routes.MapUsage;
        this._context.RegisterEvent = Events.ChangePath;

        // TODO Consider automated calculations for delta value
        for (const i in MapUsageFormItems) {
            if (Object.prototype.hasOwnProperty.call(MapUsageFormItems, i)) {
                this._context.input.push((new TextInput(MapUsageFormItems[i])).render());
            }
        }

        this._context.SubmitRootButton = (new StandardButton({
            buttonName: 'Submit Root',
            event: Events.RootAdditionSubmit,
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

        myMap.on(L.Draw.Event.CREATED, (e) => {
            const rawLatLngs = e.layer.getLatLngs()[0];
            EventBus.emit(Events.RootAddition, rawLatLngs);
            const bounds = Parser.getTrimmedRect(rawLatLngs);
            const layer = L.rectangle(bounds, {color: '#ff7800', weight: 3});
            myMap.fitBounds(bounds);

            drawnItems.clearLayers();
            drawnItems.addLayer(layer);

            const latLng = new L.LatLng((bounds[1][0] + bounds[0][0]) / 2,
                (bounds[1][1] + bounds[0][1]) / 2);
            const popup = L.popup()
                .setLatLng(latLng)
                .setContent('SW: ' + bounds[1].toString() + '<br>NE: ' + bounds[0].toString())
                .openOn(myMap);

            drawnItems.addLayer(popup);
        });

        return myMap;
    }
}
