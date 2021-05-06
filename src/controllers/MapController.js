import ManagerMap from 'utils/ManagerMap';

export default class MapController {
    async initMap(myMap) {
        return await (new ManagerMap()).initMap(myMap);
    }

    // Not implemented yet, as the selection itself not yet implemented
    async clearSelection() {
        return await (new ManagerMap()).clearSelection();
    }
}
