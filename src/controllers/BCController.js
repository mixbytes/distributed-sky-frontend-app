import ManagerBC from 'utils/ManagerBC';
import Parser from 'utils/Parser';
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
}
