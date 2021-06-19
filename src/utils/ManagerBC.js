import {ApiPromise, WsProvider} from '@polkadot/api';
import {web3Accounts, web3Enable, web3FromSource} from '@polkadot/extension-dapp';
import BCTypes from 'consts/BCTypes';
import Errors from 'consts/Errors';
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
            types: BCTypes,
        });

        this.isConnectedToNode = true;
        return true;
    }

    async accountAdd(accountAddress, role, metadataIPFSHash) {
        if (!this._isExtension) {
            if (!(await this.login())) {
                throw new Error(Errors.ExtensionsNotFound);
            }
            await this.loadUserAccounts();
        }

        if (!this._isConnectedToNode) {
            if (!await this.connectToNode()) {
                throw new Error(Errors.ConnectionToNode);
            }
        }

        const roleValue = Roles.roleValues.get(role);
        if (!Roles.rolesAllowed.has(roleValue)) {
            throw new Error(Errors.NotAllowedRole);
        }

        const accountId = this._api.createType('AccountId', accountAddress);
        // const metaIPFS = this._api.createType('MetaIPFS', metadataIPFSHash);
        const roleType = this._api.createType('AccountRole', roleValue);
        const account = this._userAccounts[0];
        const injector = await web3FromSource(account.meta.source);
        await this._api.tx.dsAccountsModule.accountAdd(accountId, roleType)
            .signAndSend(account.address, {signer: injector.signer}, ({status}) => {
                if (status.isInBlock) {
                    document.querySelector('.account-add__info').innerHTML = 'Completed at block hash';
                    const blockHashElement = document.querySelector('.block-hash');
                    blockHashElement.innerHTML = `#${status.asInBlock.toString()}`;
                    blockHashElement.classList.remove('block-hash-display-none');
                } else {
                    if (status.type === 'Finalized') {
                        document.querySelector('.account-add__info').remove();
                        document.querySelector('.block-hash').remove();
                        document.querySelector('.account-add__status').remove();
                        document.querySelector('.result-block').innerHTML = 'The account was successfully added to the registry';
                        document.querySelector('.result-block').classList.remove('result-block-display-none');
                        return;
                    }
                    const statusElement = document.querySelector('.account-add__status');
                    statusElement.innerHTML = 'Waiting for finalization...';
                    statusElement.classList.remove('status-display-none');

                    const infoElement = document.querySelector('.account-add__info');
                    infoElement.innerHTML = `Current status: ${status.type}`;
                    infoElement.classList.remove('info-display-none');
                }
            }).catch((errorMessage) => {
                throw new Error(errorMessage);
            });
    }

    async registerPilot(accountAddress, metadataIPFSHash) {
        if (!this._isExtension) {
            if (!(await this.login())) {
                throw new Error(Errors.ExtensionsNotFound);
            }
            await this.loadUserAccounts();
        }

        if (!this._isConnectedToNode) {
            if (!await this.connectToNode()) {
                throw new Error(Errors.ConnectionToNode);
            }
        }

        const accountId = this._api.createType('AccountId', accountAddress);
        const metaIPFS = this._api.createType('MetaIPFS', metadataIPFSHash);

        const account = this._userAccounts[1];
        const injector = await web3FromSource(account.meta.source);
        this._api.tx.dsAccountsModule.registerPilot(accountId, metaIPFS)
            .signAndSend(account.address, {signer: injector.signer}, ({status}) => {
                if (status.isInBlock) {
                    document.querySelector('.register-pilot__info').innerHTML = 'Completed at block hash';
                    const blockHashElement = document.querySelector('.block-hash');
                    blockHashElement.innerHTML = `#${status.asInBlock.toString()}`;
                    blockHashElement.classList.remove('block-hash-display-none');
                } else {
                    if (status.type === 'Finalized') {
                        document.querySelector('.register-pilot__info').remove();
                        document.querySelector('.block-hash').remove();
                        document.querySelector('.register-pilot__status').remove();
                        document.querySelector('.result-block').innerHTML = `The account was successfully registered as pilot.`;
                        document.querySelector('.result-block').classList.remove('result-block-display-none');
                        return;
                    }
                    const statusElement = document.querySelector('.register-pilot__status');
                    statusElement.innerHTML = 'Waiting for finalization...';
                    statusElement.classList.remove('status-display-none');

                    const infoElement = document.querySelector('.register-pilot__info');
                    infoElement.innerHTML = `Current status: ${status.type}`;
                    infoElement.classList.remove('info-display-none');
                }
            }).catch((errorMessage) => {
                throw new Error(errorMessage);
            });
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

    async rootAdd(rootCoords, rawDelta) {
        if (!this._isExtension) {
            if (!(await this.login())) {
                throw new Error(Errors.ExtensionsNotFound);
            }
            await this.loadUserAccounts();
        }

        if (!this._isConnectedToNode) {
            if (!await this.connectToNode()) {
                throw new Error(Errors.ConnectionToNode);
            }
        }

        const delta = this._api.registry.createType('RawCoord', rawDelta);

        const box3D = [];
        rootCoords.forEach((element) => box3D.push(this._api.createType('RawCoord', element)));

        const account = this._userAccounts[1];
        const injector = await web3FromSource(account.meta.source);
        await this._api.tx.dsMapsModule.rawRootAdd(box3D, delta)
            .signAndSend(account.address, {signer: injector.signer}, ({status}) => {
                if (status.isInBlock) {
                    console.log('in block now?', status);
                } else {
                    if (status.type === 'Finalized') {
                        console.log('Finalized now');
                        return;
                    }
                }
            }).catch((errorMessage) => {
                throw new Error(errorMessage);
            });

        await this.checkEvents();
    }

    async checkEvents() {
        this._api.query.system.events((events) => {
            console.log(`\nReceived ${events.length} events:`);

            // Loop through the Vec<EventRecord>
            events.forEach((record) => {
                // Extract the phase, event and the event types
                const {event, phase} = record;
                const types = event.typeDef;

                // Show what we are busy with
                console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
                console.log(`\t\t${event.meta.documentation.toString()}`);

                // Loop through each of the parameters, displaying the type and data
                event.data.forEach((data, index) => {
                    console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
                });
            });
        });
    }
}
