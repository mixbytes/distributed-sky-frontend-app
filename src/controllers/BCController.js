import ManagerBC from 'utils/ManagerBC';

export default class BCController {
    constructor() {
        this._managerBC = new ManagerBC();
    }

    async accountAdd(accountAddress, role, metadataIPFSHash = '') {
        return await this._managerBC.accountAdd(accountAddress, role, metadataIPFSHash);
    }

    async extractAccountIPFSHashFromStorage(accountAddress) {
        return await this._managerBC.extractIPFSHashFromAccount(accountAddress);
    }

    async registerPilot(accountAddress, metadataIPFSHash) {
        return await this._managerBC.registerPilot(accountAddress, metadataIPFSHash);
    }
}
