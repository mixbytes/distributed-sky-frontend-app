const Controller = require('./Controller.js');
const express = require('express');
const busboyBodyParser = require('busboy-body-parser');

const app = express();
app.use('/static', express.static('public'));
app.use(busboyBodyParser());
const port = 3001;

const controller = new Controller();

app.get('/', (req, res) => {
    controller.main(req, res);
});

app.post('/upload_to_ipfs', (req, res) => {
    controller.uploadToIPFS(req, res);
});

app.get('/connect_to_node', (req, res) => {
    controller.connectToNode(req, res);
});

app.post('/upload_to_node', (req, res) => {
    controller.uploadToNode(req, res);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

process.on('SIGTERM', () => process.exit());
process.on('uncaughtException', () => process.exit());
