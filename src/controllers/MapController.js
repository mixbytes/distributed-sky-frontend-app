import ManagerMap from 'utils/ManagerMap';

export default class MapController {
    async initRootMap(myMap) {
        return await (new ManagerMap()).initRootMap(myMap);
    }
    async initZoneMap(myMap) {
        return await (new ManagerMap()).initZoneMap(myMap);
    }
}
