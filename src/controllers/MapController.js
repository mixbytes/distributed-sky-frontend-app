import ManagerMap from 'utils/ManagerMap';

export default class MapController {
    async initMap(myMap) {
        return await (new ManagerMap()).initMap(myMap);
    }
}
