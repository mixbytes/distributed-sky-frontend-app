import ManagerBC from 'utils/ManagerBC';

export default class BCController {
    constructor() {
        this._managerBC = new ManagerBC();
    }

    async accountAdd(accountAddress, metadataIPFSHash, role) {
        const accountAddResult = async () => {
            return await this._managerBC.accountAdd(accountAddress, role, metadataIPFSHash);
        };

        accountAddResult()
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err.toString());
            });
    }
}