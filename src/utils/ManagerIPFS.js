import ipfsClient from 'ipfs-http-client';
import toBuffer from 'it-to-buffer';

const ipfs = ipfsClient({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
});

export default class ManagerIPFS {
    async uploadToIPFS(fileMetadata) {
        const file = await ipfs.add(fileMetadata).catch((err) => {
            throw new Error(err);
        });

        return file.path;
    }

    async extractFromIPFS(hash) {
        return await toBuffer(ipfs.cat(hash));
    }
}
