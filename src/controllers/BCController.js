import ManagerBC from 'utils/ManagerBC';

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

    // Not implemented yet, as the selection not yet implemented
    async rootAdd(rootCoords) {
        return await this._managerBC.rootAdd(rootCoords);
    }
}
