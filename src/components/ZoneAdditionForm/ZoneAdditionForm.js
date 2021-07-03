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

export default class ZoneAdditionForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];
        this.myMap = '';
        this.drawnItems = '';
        this.bbox = '';
        this.popup = '';
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
        this.myMap = myMap;

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

        this.drawnItems = L.featureGroup().addTo(myMap);

        const popup = L.popup();
        this.popup = popup;

        function onMapClick(e) {
            EventBus.emit(Events.RootRequest, [e.latlng.lat, e.latlng.lng]);
            popup
                .setLatLng(e.latlng)
                .setContent('You requested root at ' + e.latlng.lat.toString() + '<br>' + e.latlng.lng.toString())
                .openOn(myMap);
        }

        myMap.on('click', onMapClick);

        return myMap;
    }

    drawRoot(bbox) {
        if (this.isNull(bbox)) {
            this.popup.setContent('There is no Root!').openOn(this.myMap);
        } else if (this.compare(bbox, this.bbox)) {
            this.bbox = bbox;
            const layer = L.rectangle(bbox, {color: '#ff7800', weight: 1}).addTo(this.myMap);
            this.drawnItems.clearLayers();
            this.drawnItems.addLayer(layer);
            this.myMap.fitBounds(bbox);
            this.popup.setContent('Here is your root').openOn(this.myMap);
        } else { // TODO write an error handling for this
            this.popup.setContent('You already selected this root!').openOn(this.myMap);
        }
    }

    isNull(a) {
        return a[0][0] === 0 && a[0][1] === 0 &&
            a[1][0] === 0 && a[1][1] === 0;
    }

    compare(a1, a2) {
        if (a2 === '') return true;
        return !(a1[0][0] === a2[0][0] && a1[0][1] === a2[0][1] &&
            a1[1][0] === a2[1][0] && a1[1][1] === a2[1][1]);
    }
}
