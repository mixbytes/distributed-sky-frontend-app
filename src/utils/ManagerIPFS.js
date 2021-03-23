import ipfsClient from 'ipfs-http-client';
// import Hash from 'ipfs-only-hash';
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
        await ipfs.add(file).catch((err) => {
            error = err;
        });

        if (error.length !== 0) {
            return error;
        }
        return fileMetadata.data;
        // return await Hash.of(fileMetadata.data);
    }

    async extractFromIPFS(hash) {
        return await toBuffer(ipfs.cat(hash));
    }
}
