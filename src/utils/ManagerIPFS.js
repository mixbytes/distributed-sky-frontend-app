import ipfsClient from 'ipfs-http-client';
import toBuffer from 'it-to-buffer';

const ipfs = ipfsClient({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
});

export default class ManagerIPFS {
    async uploadToIPFS(fileMetadata) {
        const file = {path: fileMetadata.name, content: fileMetadata.data};
        let error = '';
        const ipfsHash = await ipfs.add(file).catch((err) => {
            error = err;
        });

        if (error.length !== 0) {
            return error;
        }

        return ipfsHash.cid.string;
    }

    async extractFromIPFS(hash) {
        return await toBuffer(ipfs.cat(hash));
    }
}
