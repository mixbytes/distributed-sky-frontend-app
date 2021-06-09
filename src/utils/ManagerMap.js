import L from 'leaflet';
import AutoGraticule from 'leaflet-auto-graticule';

export default class ManagerMap {
    async initMap(myMap) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 12,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(myMap);

        const options = {
            /** Leaflet map event on which to redraw the graticule. */
            redraw: 'move',
            /** Minimum distance in pixels between two graticule lines. */
            minDistance: 50,
        };
        // TODO rewrite AutoGraticule for our needs (stepping w 0.1 degree especially)
        new AutoGraticule(options).addTo(myMap);
    }
}
