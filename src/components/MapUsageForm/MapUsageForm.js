import BaseComponent from 'components/BaseComponent';
import Events from 'consts/Events';
import L from 'leaflet';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/MapUsageForm/MapUsageForm.hbs';
import 'leaflet-draw';

export default class MapUsageForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        this._context.RegisterPath = Routes.MapUsage;
        this._context.RegisterEvent = Events.ChangePath;
        // This two buttons are just stubs for now
        this._context.SubmitRootButton = (new StandardButton({
            buttonName: 'Submit Root',
            event: Events.AccountAddSubmit,
        })).render();

        this._context.ResetButton = (new StandardButton({
            buttonName: 'Reset selection',
            event: Events.AccountAddSubmit,
        })).render();
    }

    drawMap() {
        // If map already exists, replace w new one
        const container = L.DomUtil.get('mapid');
        if (container != null) {
            container._leaflet_id = null;
        }

        // Setting default location to Moscow
        const myMap = L.map('mapid').setView([55.751, 37.618], 10);


        let drawnItems = L.featureGroup().addTo(myMap);

        myMap.addControl(new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                poly: {
                    allowIntersection: false
                }
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true
                }
            }
        }));

        const popup = L.popup();
        // binding leaflet events to map clicks
        myMap.on('click', (e) => {
            popup
                .setLatLng(e.latlng)
                .setContent('You clicked the map at ' + e.latlng.toString())
                .openOn(myMap);
        });

        myMap.on(L.Draw.Event.CREATED, function (event) {
            let layer = event.layer;
            console.log(event);  
            drawnItems.addLayer(layer);
        });

        return myMap;
    }
}
