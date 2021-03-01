const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { readFileSync } = require('fs');
const { roles, roles_allowed } = require('../consts/roles.js');

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

    async accountAdd(accountAddress, role, metadata_ipfs_hash) {
        const role_value = roles.get(role);
        if (!roles_allowed.has(role_value)) {
            throw new Error('Given role is not allowed');
        }

        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        const keyring = new Keyring({ type: 'sr25519' });
        const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

        const metaIPFS = this.api.createType('MetaIPFS', metadata_ipfs_hash);
        const roleType = this.api.createType('AccountRole', role_value);

        // Replace with commented string when admin account will be fixed
        // await this.api.tx.dsAccountsModule.accountAdd(bob.address, roleType, metaIPFS).signAndSend(bob);
        await this.api.tx.dsAccountsModule.accountAdd(bob.address, roleType, metaIPFS).signAndSend(bob);

        return `Account ${accountAddress} with role: ${role} was successfully added to registry.`;
    }

    async registerPilot(accountAddress, metadata_ipfs_hash) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        const keyring = new Keyring({ type: 'sr25519' });
        const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

        const metaIPFS = this.api.createType('MetaIPFS', metadata_ipfs_hash);

        this.api.tx.dsAccountsModule.registerPilot(accountAddress, metaIPFS).signAndSend(bob)

        return `Account ${accountAddress} was successfully registered as pilot.`;
    }

    async extractAccountFromNode(accountId) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        accountId = this.api.createType('AccountId', accountId);

        return await this.api.query.dsAccountsModule.accountRegistry(accountId);
    }

    async extractIPFSHashFromAccount(accountId) {
        const account = await this.extractAccountFromNode(accountId);

        return account['metadata_ipfs_hash'].toHuman();
    }
}

module.exports = ManagerBC;
