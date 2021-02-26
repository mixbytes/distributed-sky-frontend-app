const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { readFileSync } = require('fs');

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

    async accountAdd(role, metadata_ipfs_hash) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        const keyring = new Keyring({ type: 'sr25519' });
        const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });
        const somebody = keyring.addFromMnemonic('magic flight monster twist divide bring wrist laundry kid front cloth celery');

        const metaIPFS = this.api.createType('MetaIPFS', metadata_ipfs_hash);
        const roleType = this.api.createType('AccountRole', role);

        await this.api.tx.dsAccountsModule.accountAdd(bob.address, roleType, metaIPFS).signAndSend(bob);

        const accountId = this.api.createType('AccountId', somebody.address);
        const account = await this.extractAccountFromNode(accountId);

        return account.toString();
    }

    async registerPilot(metadata_ipfs_hash) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        const keyring = new Keyring({ type: 'sr25519' });
        const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });
        const somebody = keyring.addFromMnemonic('magic flight monster twist divide bring wrist laundry kid front cloth celery');

        const metaIPFS = this.api.createType('MetaIPFS', metadata_ipfs_hash);

        this.api.tx.dsAccountsModule.registerPilot(somebody.address, metaIPFS).signAndSend(bob)

        const accountId = this.api.createType('AccountId', somebody.address);
        const account = await this.extractAccountFromNode(accountId);

        return account.toString();
    }

    async extractAccountFromNode(accountId) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        return await this.api.query.dsAccountsModule.accountRegistry(accountId);
    }

    async extractIPFSHashFromAccount(accountId) {
        const account = await this.extractAccountFromNode(accountId);

        return account['metadata_ipfs_hash'].toHuman();
    }
}

module.exports = ManagerBC;
