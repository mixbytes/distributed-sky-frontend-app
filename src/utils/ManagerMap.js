import L from 'leaflet';
import 'components/MapUsageForm/Graticule';

export default class ManagerMap {
    async initRootMap(myMap) {
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
                {start: 8, end: 20, interval: 0.1},
            ],
        };
        // TODO rewrite AutoGraticule for our needs (stepping w 0.1 degree especially)
        new L.LatLngGraticule(options).addTo(myMap);
    }

    async initZoneMap(myMap) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(myMap);
    }

    // Note to self [[sw_lat, sw_lon], [ne_lat, ne_lon]]
    // TODO consider converter to JSON and back, JSON easier to understand while reading, but array easier to use
    // Returns (IsSplitted, [zones; 2-4])
    static trySplitZone(root, zoneBbox) {
        const delta = root.delta;
        const rootBbox = root.bounding_box;
        const localZone = ManagerMap.toLocal(rootBbox, zoneBbox);

        const area1Lat = Math.trunc(localZone[0][0] / delta);
        const area2Lat = Math.trunc(localZone[1][0] / delta);
        const area1Lon = Math.trunc(localZone[0][1] / delta);
        const area2Lon = Math.trunc(localZone[1][1] / delta);
        const output = [];
        // TODO consider restricting (bbox size) < (2 * delta), or handling it (for now max splitting is up to 4)
        if (!(area1Lon === area2Lon)) {
            const lonSplitLine = (area1Lon + 1) * delta;
            const leftZone = ManagerMap.toGlobal(rootBbox, [localZone[0], [localZone[1][0], lonSplitLine]]);
            const rightZone = ManagerMap.toGlobal(rootBbox, [[localZone[0][0], lonSplitLine], localZone[1]]);
            output.push(leftZone);
            output.push(rightZone);
        } else {
            output.push(localZone);
        }
        if (!(area1Lat === area2Lat)) {
            let totalZones = 1;
            output.forEach((splitZone, index) => {
                totalZones = index;
                const latSplitLine = (area1Lat + 1) * delta;
                const localSplitZone = ManagerMap.toLocal(rootBbox, splitZone);
                const topZone = ManagerMap.toGlobal(rootBbox, [localSplitZone[0], [latSplitLine, localSplitZone[1][1]]]);
                const bottomZone = ManagerMap.toGlobal(rootBbox, [[latSplitLine, localSplitZone[0][1]], localSplitZone[1]]);
                // output.shift();
                output.push(topZone);
                output.push(bottomZone);
            });
            while (totalZones >= 0) {
                output.shift();
                totalZones -= 1;
            }
        }
        if (output.length === 1) {
            output[0] = ManagerMap.toGlobal(rootBbox, output[0]);
        }
        return output;
    }

    static toLocal(base, target) {
        const output = [[], []];
        output[0][0] = Math.abs(target[0][0] - base[0][0]);
        output[1][0] = Math.abs(target[1][0] - base[0][0]);
        output[0][1] = Math.abs(target[0][1] - base[0][1]);
        output[1][1] = Math.abs(target[1][1] - base[0][1]);
        return output;
    }

    static toGlobal(base, target) {
        const output = [[], []];
        output[0][0] = target[0][0] + base[0][0];
        output[1][0] = target[1][0] + base[0][0];
        output[0][1] = target[0][1] + base[0][1];
        output[1][1] = target[1][1] + base[0][1];
        return output;
    }
}
