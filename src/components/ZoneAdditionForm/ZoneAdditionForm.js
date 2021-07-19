import BaseComponent from 'components/BaseComponent';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import L from 'leaflet';
import 'leaflet-draw';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/ZoneAdditionForm/ZoneAdditionForm.hbs';
import Parser from 'utils/Parser';
import ManagerMap from 'utils/ManagerMap';

export default class ZoneAdditionForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];
        this.myMap = '';
        this.drawnRoot = '';
        this.drawnZone = '';
        this.root = {
            id: '',
            bounding_box: '',
            delta: '',
        };
        // TODO remove this event thing
        this.RootRequestEvent = '';
        this.popup = '';
        this._context.RegisterPath = Routes.ZoneAddition;
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
                marker: false,
                polygon: false,
                circlemarker: false,
                circle: false,
                polyline: false,
            },
        }));

        this.drawnRoot = L.featureGroup().addTo(myMap);
        this.drawnZone = L.featureGroup().addTo(myMap);

        const popup = L.popup();
        this.popup = popup;

        function onMapClick(e) {
            EventBus.emit(Events.RootRequest, [e.latlng.lat, e.latlng.lng]);
            popup
                .setLatLng(e.latlng)
                .setContent('You requested root at ' + e.latlng.lat.toString() + '<br>' + e.latlng.lng.toString())
                .openOn(myMap);
        }

        this.RootRequestEvent = onMapClick;
        myMap.on('click', onMapClick);

        return myMap;
    }

    drawRoot(root) {
        if (this.isNull(root.bounding_box)) {
            this.popup.setContent('There is no Root!').openOn(this.myMap);
        } else if (this.compare(root.bounding_box, this.root.bounding_box)) {
            this.root = root;
            const layer = L.rectangle(root.bounding_box, {
                color: '#ff7800',
                fillOpacity: 0.1,
                weight: 1,
            }).addTo(this.myMap);
            this.drawnRoot.clearLayers();
            this.drawnRoot.addLayer(layer);
            this.myMap.fitBounds(root.bounding_box);
            this.popup.setContent('You successfully selected root.<br> Now add zones!').openOn(this.myMap);
            // TODO add button for this mode change. Important, because this way we cant choose different root.
            this.myMap.off('click', this.RootRequestEvent);
            this.changeMode();
        } else {
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

    // enabled only if root is already selected
    changeMode() {
        this.myMap.on(L.Draw.Event.CREATED, (e) => {
            const rawLatLngs = e.layer.getLatLngs()[0];
            const bounds = Parser.getRect(rawLatLngs);

            const layer = L.rectangle(bounds, {color: '#08ff00', weight: 3});
            this.myMap.fitBounds(bounds);

            this.drawnZone.clearLayers();
            this.drawnZone.addLayer(layer);
            const zones = ManagerMap.trySplitZone(this.root, bounds);

            // TODO consider removing this, maybe all splitting shall be internal
            if (zones.length !== 1) {
                console.warn('[WARN] Selected zone lies in ' + zones.length + ' areas!');
                zones.forEach((item) => {
                    const newLayer = L.rectangle(item, {color: '#000000', weight: 3});
                    this.drawnZone.addLayer(newLayer);
                });
            }

            EventBus.emit(Events.ZoneAddition, zones);

            const latLng = new L.LatLng(
                (bounds[1][0] + bounds[0][0]) / 2,
                (bounds[1][1] + bounds[0][1]) / 2);

            const popup = L.popup()
                .setLatLng(latLng)
                .setContent('You selected zone!<br>Click submit to add it!')
                .openOn(this.myMap);

            this.drawnZone.addLayer(popup);
        });
    }
}
