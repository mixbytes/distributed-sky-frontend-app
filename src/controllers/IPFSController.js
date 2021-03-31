import ManagerIPFS from 'utils/ManagerIPFS';

export default class IPFSController {
    async uploadToIPFS(file) {
        return await (new ManagerIPFS()).uploadToIPFS(file);
    }

    async extractFromIPFS(hash) {
        return await (new ManagerIPFS()).extractFromIPFS(hash);
    }
}
