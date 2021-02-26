const ipfsClient = require('ipfs-http-client');
const Hash = require('ipfs-only-hash')

const ipfs = ipfsClient('http://localhost:5001');

class ManagerIPFS {
    async uploadToIPFS(fileMetadata) {
        const file = {path: fileMetadata.name, content: fileMetadata.data};
        await ipfs.add(file).catch((err) => console.log(err));

        return await Hash.of(fileMetadata.data);
    }

    // Получить файл по IPFS-хешу и отдельно реализовать
    // функциональность для отображения картинки
    async downloadFromIPFS(hash) {
        const bufferedContents = await toBuffer(ipfs.cat(hash));

        return bufferedContents.toString();
    }
}

module.exports = ManagerIPFS;
