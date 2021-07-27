import BaseComponent from 'components/BaseComponent';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import L from 'leaflet';
import 'leaflet-draw';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/RouteAdditionForm/RouteAdditionForm.hbs';
import Parser from 'utils/Parser';

export default class RouteAdditionForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];
        this.myMap = '';
        this.drawnRoot = '';
        this.drawnRoute = '';
        this.root = {
            id: '',
            bounding_box: '',
            delta: '',
        };
        this.RootRequestEvent = '';
        this.popup = '';
        this._context.RegisterPath = Routes.ZoneAddition;
        this._context.RegisterEvent = Events.ChangePath;

        this._context.SubmitRootButton = (new StandardButton({
            buttonName: 'Add Route',
            event: Events.RouteAdditionSubmit,
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
                rectangle: false,
                polyline: true,
            },
        }));

        this.drawnRoot = L.featureGroup().addTo(myMap);
        this.drawnRoute = L.featureGroup().addTo(myMap);

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
            this.popup.setContent('You successfully selected root.<br> Now add route!').openOn(this.myMap);
            // TODO add button for this mode change. Important, because this way we can't choose different root
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
            const rawLatLngs = e.layer.getLatLngs();
            console.log(rawLatLngs);
            if (rawLatLngs.length > 2) {
                alert('Please, supply two-point route');
                return;
            }
            const polyline = Parser.getLine(rawLatLngs);

            const layer = L.polyline(polyline, {color: 'green', weight: 3});

            this.drawnRoute.clearLayers();
            this.drawnRoute.addLayer(layer);

            EventBus.emit(Events.RouteAddition, polyline);

            const latLng = new L.LatLng(
                (polyline[1][0] + polyline[0][0]) / 2,
                (polyline[1][1] + polyline[0][1]) / 2);

            const popup = L.popup()
                .setLatLng(latLng)
                .setContent('You drawn a new route!<br>Click submit to add it!')
                .openOn(this.myMap);

            this.drawnRoute.addLayer(popup);
        });
    }
}
