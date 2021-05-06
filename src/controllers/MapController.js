import ManagerMap from 'utils/ManagerMap';

export default class MapController {
    async InitMap() {
        return await (new ManagerMap()).initMap();
    }
}
