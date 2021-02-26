const ipfsClient = require('ipfs-http-client');
const Hash = require('ipfs-only-hash')
const toBuffer = require("it-to-buffer");

const ipfs = ipfsClient('http://localhost:5001');

class ManagerIPFS {
    async uploadToIPFS(fileMetadata) {
        const file = {path: fileMetadata.name, content: fileMetadata.data};
        await ipfs.add(file).catch((err) => console.log(err));

        return await Hash.of(fileMetadata.data);
    }

    async downloadFromIPFS(hash) {
        return await toBuffer(ipfs.cat(hash));
    }
}

module.exports = ManagerIPFS;
