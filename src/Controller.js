const ManagerIPFS = require('./utils/ManagerIPFS.js');
const ManagerBC = require('./utils/ManagerBC.js');
const path = require('path');
const root = path.join(__dirname, '../public');

const managerIPFS = new ManagerIPFS();
const managerBC = new ManagerBC();

class Controller {
    main(req, res) {
        res.sendFile(`${root}/index.html`);
    }

    uploadToIPFS(req, res) {
        const file = req.files['ipfs_file'];

        const getIpfsHash = async () => {
            return await managerIPFS.uploadToIpfs(file);
        };

        getIpfsHash()
            .then((hash) => res.send(hash))
            .catch((err) => res.send(err));
    }

    uploadToNode(req, res) {
        const hash = req.body['file_hash'];

        const uploadToNodeResult = async () => {
            return await managerBC.uploadToNode(hash);
        };

        uploadToNodeResult()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => res.send(err));
    }

    connectToNode(req, res) {
        const connectToNodeResult = async () => {
            return await managerBC.connectToNode();
        };

        connectToNodeResult()
            .then((result) => {
                console.log(result);
                res.send(result);
            })
            .catch((err) => res.send(err));
    }
}

module.exports = Controller;
