const ipfsClient = require('ipfs-http-client');
const Hash = require('ipfs-only-hash')

const ipfs = ipfsClient('http://localhost:5001');

class ManagerIPFS {
    async upload_to_ipfs(fileMetadata) {
        const file = {path: fileMetadata.name, content: fileMetadata.data};
        await ipfs.add(file).catch((err) => console.log(err));

        return await Hash.of(fileMetadata.data);
    }
}

module.exports = ManagerIPFS;
