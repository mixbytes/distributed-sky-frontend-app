import Routes from 'consts/Routes';
import Events from 'consts/Events';
import BaseComponent from 'components/BaseComponent';
// import menuItems from 'consts/Menu';
import EventBus from 'services/EventBus';
import template from 'components/MapComponent/MapComponent.hbs';

export default class MapComponent extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;

        this._context.RegisterPath = Routes.UseMap;
        this._context.RegisterEvent = Events.ChangePath;

        let my_div = document.querySelector(".use-map-form");
        // my_div.appendChild(elementMapId);
        // document.body.appendChild(elementMapId);
        if(my_div) {
            console.log("my div is found")
        } else {
            console.log("my div is not found")};
        let element = document.getElementById("mapid");
        // document.body.insertBefore(element, my_div);
        let elementMapId = document.createElement("div");

        // elementMapId.id = "mapid";
        // elementMapId.style = "width: 100%; height: 100%;";
        // elementMapId.tabindex = "1";
        // this._context.Map = elementMapId;
        // document.body.appendChild(elementMapId);

        if(element){
            console.log("found maps");

            let mapid = L.map('mapid').setView([51.505, -0.09], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(mapid);
            this._context.Map = mapid; 
        } else {
            console.log("not found maps");
        }
    }
}
