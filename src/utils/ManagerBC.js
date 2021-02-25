const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a, u8aToHex } = require('@polkadot/util');
const { readFileSync } = require('fs');
const testKeyring = require('@polkadot/keyring/testing');

class ManagerBC {
    isConnectedToNode;
    api;

    async connectToNode() {
        const provider = new WsProvider('ws://127.0.0.1:9944');
        this.api = await ApiPromise.create({
            provider: provider,
            types: JSON.parse(readFileSync('src/types.json', 'utf8')),
        });

        const [chain, nodeName, nodeVersion] = await Promise.all([
            this.api.rpc.system.chain(),
            this.api.rpc.system.name(),
            this.api.rpc.system.version(),
        ]);

        console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
        this.isConnectedToNode = true;
    }

    async uploadToNode(hash) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        console.log("Start");

        const keyring = new Keyring({ type: 'sr25519' });
        const master = keyring.addFromUri('//Alice', {
            name: 'Alice (master)'
        });
        const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

        console.log("Creating admin [Alice] pair");
        const adminId = await this.api.query.sudo.key();
        console.log("Admin id created: ", adminId.toString());
        const keyring_test = testKeyring.createTestKeyring();
        const adminPair = keyring_test.getPair(adminId.toString());
        console.log("Admin [Alice] pair created: ", adminPair.toJson());

        const [result_balances] = await Promise.all([
            this.api.tx.balances.setBalance(master.address, 100000, 100).signAndSend(bob)
        ]);
        console.log(result_balances);

        console.log('Before transaction');

        const metaIPFS = this.api.createType('MetaIPFS', hash);
        const registrar = this.api.createType('AccountRole', '0x04');
        console.log('metaIPFS: ', metaIPFS.toString());
        console.log('registrar:', registrar.toString());
        const [result_add] = await Promise.all([
            /*
            this.api.tx.sudo
                .sudo(this.api.tx.dsAccountsModule.accountAdd(master.address, registrar, metaIPFS))
                .signAndSend(bob)
            */
            this.api.tx.sudo
                .sudo(this.api.tx.dsAccountsModule.registerPilot(bob.address, metaIPFS))
                .signAndSend(bob)
        ]);
        console.log('Transaction hash: ', result_add.toString());
        console.log('Successful transaction');

        console.log('Trying to retrieve hash');
        const accountId = this.api.createType('AccountId', bob.address);
        const [result_hash] = await Promise.all([
           this.api.query.dsAccountsModule.accountRegistry(accountId)
        ]);
        console.log(result_hash.toString());

        /*
        console.log(
            await this.api.rpc.rpc.methods()
        );*/

        console.log('End');

        return hash;
    }
}

module.exports = ManagerBC;
