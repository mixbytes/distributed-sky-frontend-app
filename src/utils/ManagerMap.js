import L from 'leaflet';
import AutoGraticule from 'leaflet-auto-graticule';
import 'components/MapUsageForm/Graticule'

export default class ManagerMap {
    async initMap(myMap, addGrid) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 12,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(myMap);
        
        if (addGrid) {
            const options = {
                showLabel: true,
                opacity: 1,
                weight: 0.8,
                color: '#000',
                font: '12px Verdana',
                lngLineCurved: 0,
                latLineCurved: 0,
                zoomInterval: [
                    {start: 2, end: 2, interval: 40},
                    {start: 3, end: 3, interval: 20},
                    {start: 4, end: 4, interval: 10},
                    {start: 5, end: 7, interval: 5},
                    {start: 8, end: 20, interval: 0.1}
                ]
            };
            // TODO rewrite AutoGraticule for our needs (stepping w 0.1 degree especially)
            new L.LatLngGraticule(options).addTo(myMap);
        }
    }
}
