import ManagerBC from 'utils/ManagerBC';
import Parser from 'utils/Parser';
import * as wasm from 'wasm_indexes';

export default class BCController {
    constructor() {
        this._managerBC = new ManagerBC();
    }

    async accountAdd(accountAddress, role) {
        return await this._managerBC.accountAdd(accountAddress, role);
    }

    async extractAccountIPFSHashFromStorage(accountAddress) {
        return await this._managerBC.extractIPFSHashFromAccount(accountAddress);
    }

    async registerPilot(accountAddress, metadataIPFSHash) {
        return await this._managerBC.registerPilot(accountAddress, metadataIPFSHash);
    }

    async rootAdd(rawRootCoords, rawDelta) {
        const parseData = Parser.getRectCoords(rawRootCoords);
        const delta = Parser.parseToCoord(parseFloat(rawDelta));

        return await this._managerBC.rootAdd(parseData, delta);
    }

    async rootRequest(touchLat, touchLon) {
        const latFix = Parser.parseToCoord(Parser.trimTo(parseFloat(touchLat), 5));
        const lonFix = Parser.parseToCoord(Parser.trimTo(parseFloat(touchLon), 5));
        const index = wasm.index_generate(latFix, lonFix);

        return await this._managerBC.rootRequest(index, touchLat, touchLon);
    }
}
