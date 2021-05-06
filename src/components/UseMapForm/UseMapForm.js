import BaseComponent from 'components/BaseComponent';
import Events from 'consts/Events';
import L from 'leaflet';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/UseMapForm/UseMapForm.hbs';

export default class UseMapForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        this._context.RegisterPath = Routes.UseMap;
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
        const mymap = L.map('mapid').setView([55.751, 37.618], 10);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 19,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(mymap);

        const popup = L.popup();
        // So, this is weird way to handle events. But otherwise, we can't get latlng.
        mymap.on('click', (e) => {
            popup
                .setLatLng(e.latlng)
                .setContent('You clicked the map at ' + e.latlng.toString())
                .openOn(mymap);
        });
    }
}
