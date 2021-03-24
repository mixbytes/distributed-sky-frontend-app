import {ApiPromise, WsProvider} from '@polkadot/api';
import {web3Accounts, web3Enable, web3FromSource} from '@polkadot/extension-dapp';
import Roles from 'consts/Roles';

export default class ManagerBC {
    constructor() {
        this._isExtension = false;
        this._isConnectedToNode = false;
        this._api = {};
        this._userAccounts = [];
    }

    async login() {
        const extensions = await web3Enable('DistributedSky');

        if (extensions.length === 0) {
            alert('No extension installed, or you did not accept the authorization');
            return false;
        }

        this._isExtension = true;
        return true;
    }

    async loadUserAccounts() {
        this._userAccounts = await web3Accounts();
    }

    async connectToNode() {
        const provider = new WsProvider('ws://127.0.0.1:9944');
        this._api = await ApiPromise.create({
            provider: provider,
            types: {
                'AccountRole': 'u8',
                'AccountManager': 'AccountId',
                'Address': 'AccountId',
                'LookupSource': 'AccountId',
                'Moment': 'u64',
                'AccountOf': {
                    'roles': 'AccountRole',
                    'create_date': 'u64',
                    'managed_by': 'AccountManager',
                    'metadata_ipfs_hash': 'MetaIPFS',
                },
                'SerialNumber': 'Vec<u8>',
                'MetaIPFS': 'Vec<u8>',
                'UAVOf': {
                    'uav_id': 'SerialNumber',
                    'metadata_ipfs_hash': 'MetaIPFS',
                    'managed_by': 'AccountId',
                },
            },
        });

        this.isConnectedToNode = true;
        return true;
    }

    async accountAdd(accountAddress, role, metadataIPFSHash) {
        if (!this._isExtension) {
            if (!(await this.login())) {
                return 'fail';
            }
            await this.loadUserAccounts();
        }

        if (!this._isConnectedToNode) {
            if (!await this.connectToNode()) {
                return 'fail';
            }
        }

        const roleValue = Roles.roleValues.get(role);
        if (!Roles.rolesAllowed.has(roleValue)) {
            throw new Error('Given role is not allowed');
        }

        const accountId = this._api.createType('AccountId', accountAddress);
        const metaIPFS = this._api.createType('MetaIPFS', metadataIPFSHash);
        const roleType = this._api.createType('AccountRole', roleValue);

        const account = this._userAccounts[0];
        const injector = await web3FromSource(account.meta.source);
        let error = '';
        await this._api.tx.dsAccountsModule.accountAdd(accountId, roleType, metaIPFS)
            .signAndSend(account.address, {signer: injector.signer}, ({status}) => {
                if (status.isInBlock) {
                    console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                } else {
                    console.log(`Current status: ${status.type}`);
                }
            }).catch((errorMessage) => {
                error = errorMessage;
            });
        if (error.length !== 0) {
            return error;
        }

        return `Account ${accountAddress} with role: ${role} was successfully added to registry.`;
    }

    async registerPilot(accountAddress, metadataIPFSHash) {
        if (!this._isExtension) {
            if (!(await this.login())) {
                return 'fail';
            }
            await this.loadUserAccounts();
        }

        if (!this._isConnectedToNode) {
            if (!await this.connectToNode()) {
                return 'fail';
            }
        }

        const accountId = this._api.createType('AccountId', accountAddress);
        const metaIPFS = this._api.createType('MetaIPFS', metadataIPFSHash);

        const account = this._userAccounts[1];
        const injector = await web3FromSource(account.meta.source);
        let error = '';
        this._api.tx.dsAccountsModule.registerPilot(accountId, metaIPFS)
            .signAndSend(account.address, {signer: injector.signer}, ({status}) => {
                if (status.isInBlock) {
                    console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                } else {
                    console.log(`Current status: ${status.type}`);
                }
            }).catch((errorMessage) => {
                error = errorMessage;
            });
        if (error.length !== 0) {
            return error;
        }
        return `Account ${accountAddress} was successfully registered as pilot.`;
    }

    async extractAccountFromStorage(accountId) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        accountId = this._api.createType('AccountId', accountId);

        return await this._api.query.dsAccountsModule.accountRegistry(accountId);
    }

    async extractIPFSHashFromAccount(accountId) {
        const account = await this.extractAccountFromStorage(accountId);

        return account['metadata_ipfs_hash'].toHuman();
    }
}
