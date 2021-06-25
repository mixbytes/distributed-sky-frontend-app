import ManagerMap from 'utils/ManagerMap';

export default class MapController {
    async initMap(myMap, addGrid) {
        return await (new ManagerMap()).initMap(myMap, addGrid);
    }
}
