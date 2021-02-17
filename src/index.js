const ManagerIPFS = require('./ManagerIPFS.js');
const express = require('express');
const busboyBodyParser = require('busboy-body-parser');
const path = require('path');

const app = express();
app.use('/static', express.static('public'));
app.use(busboyBodyParser());
const port = 3001;
const root = path.join(__dirname, '../public');

const managerIPFS = new ManagerIPFS();

app.get('/upload_to_ipfs', (req, res) => {
    res.sendFile(`${root}/index.html`);
});

app.post('/upload_to_ipfs', (req, res) => {
    const file = req.files['ipfs_file'];

    const get_ipfs_hash = async () => {
        return await managerIPFS.upload_to_ipfs(file);
    };

    get_ipfs_hash().then((hash) => res.send(hash)).catch((err) => res.send(err));
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
