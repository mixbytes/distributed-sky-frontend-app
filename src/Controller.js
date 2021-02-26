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

        const getIPFSHash = async () => {
            return await managerIPFS.uploadToIPFS(file);
        };

        getIPFSHash()
            .then((hash) => res.send(hash))
            .catch((err) => res.send(err));
    }

    registerPilot(req, res) {
        const hash = req.body['file_hash'];

        const registerPilotResult = async () => {
            return await managerBC.registerPilot(hash);
        };

        registerPilotResult()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => res.send(err));
    }

    accountAdd(req, res) {
        const hash = req.body['file_hash'];

        const accountAddResult = async () => {
            return await managerBC.accountAdd('0x04', hash);
        };

        accountAddResult()
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

    extractIPFSHashFromNode(req, res) {
        const hash = req.query['account_id'];

        const extractAccountFromNodeResult = async () => {
            return await managerBC.extractIPFSHashFromAccount(hash);
        };

        extractAccountFromNodeResult()
            .then((result) => {
                console.log(result);
                res.send(result);
            })
            .catch((err) => res.send(err));
    }

    extractPNGFromIPFS(req, res) {
        const hash = req.query['png_hash'];

        const extractPNGFromIPFSResult = async () => {
            return await managerIPFS.downloadFromIPFS(hash);
        };

        extractPNGFromIPFSResult()
            .then((result) => {
                res.render(`${root}/pilot_png.html`, {
                    image: Buffer.from(result).toString('base64')
                });
            })
            .catch((err) => console.log(err));
    }
}

module.exports = Controller;
