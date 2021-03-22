import ManagerBC from 'utils/ManagerBC';

export default class BCController {
    constructor() {
        this._managerBC = new ManagerBC();
    }

    async accountAdd(accountAddress, metadataIPFSHash, role) {
        return await this._managerBC.accountAdd(accountAddress, role, metadataIPFSHash);
    }
}