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
    }

draw_map() {
        let element = document.getElementById("mapid");

        console.log("found maps");
        element = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(element);

        // function onMapClick(e) {
        //     popup
        //         .setLatLng(e.latlng)
        //         .setContent("You clicked the map at " + e.latlng.toString())
        //         .openOn(mymap);
        // }

        // mymap.on('click', onMapClick);
    }
}