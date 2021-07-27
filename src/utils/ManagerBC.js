import {ApiPromise, WsProvider} from '@polkadot/api';
import {web3Accounts, web3Enable, web3FromSource} from '@polkadot/extension-dapp';
import BCTypes from 'consts/BCTypes';
import Errors from 'consts/Errors';
import Roles from 'consts/Roles';
import Parser from 'utils/Parser';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';

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
        console.log(box3D);
        await this._api.tx.dsMapsModule.rawRootAdd(box3D, delta)
            .signAndSend(account.address, {signer: injector.signer}, ({ status, events, dispatchError }) => {
                // status would still be set, but in the case of error we can shortcut
                // to just check it (so an error would indicate InBlock or Finalized)
                if (dispatchError) {
                  if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = this._api.registry.findMetaError(dispatchError.asModule);
                    const { documentation, name, section } = decoded;
            
                    console.log(`${section}.${name}: ${documentation.join(' ')}`);
                  } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    console.log(dispatchError.toString());
                  }
                } else {
                    this.checkEvents();
                }
            });
    }

    async rootRequest(index, touchLat, touchLon) {
        if (!this.isConnectedToNode) {
            await this.connectToNode();
        }

        // consts from BC
        const pageLength = 32;
        const pageWidth = 50;
        // calculating cell coords in global grid
        // TODO debug this fn, sometimes requested bitmap is just zeroes (lat/lon messed up?)
        // 0001 0101 1110 0000(5600) 0000 1110 1101 1000 - correct
        // 0001 0101 1100 0000(5568) 0000 1110 1101 1000 - wrong
        const bitmap = await this._api.query.dsMapsModule.earthBitmap(index);
        const row = Math.trunc(touchLat * 100);
        const column = Math.trunc(touchLon * 100);
        // TODO this is ok, I checked
        const rootId = bitmap[column % pageLength][row % pageWidth];

        const _rootBox = await this._api.query.dsMapsModule.rootBoxes(rootId);

        const swLatCoord = Parser.parseNodeOutput(_rootBox['bounding_box']['south_west']['lat'].toHuman());
        const swLonCoord = Parser.parseNodeOutput(_rootBox['bounding_box']['south_west']['lon'].toHuman());
        const neLatCoord = Parser.parseNodeOutput(_rootBox['bounding_box']['north_east']['lat'].toHuman());
        const neLonCoord = Parser.parseNodeOutput(_rootBox['bounding_box']['north_east']['lon'].toHuman());
        const floatBox3D = [[swLatCoord, swLonCoord], [neLatCoord, neLonCoord]];
        const rootBox = {
            id: _rootBox['id'],
            bounding_box: floatBox3D,
            delta: Parser.parseNodeOutput(_rootBox['delta'].toHuman()),
        };
        EventBus.emit(Events.RootShow, rootBox);
    }

    async zoneAdd(_zones, _rootId) {
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
        const _height = 10;
        const rootId = _rootId;
        const height = this._api.registry.createType('LightCoord', _height);
        const zones = [];
        _zones.forEach((_zone) => {
            const zone = [];
            _zone.forEach((element) => zone.push(this._api.createType('RawCoord', element)));
            zones.push(zone);
        });

        const account = this._userAccounts[1];
        const injector = await web3FromSource(account.meta.source);
        for (let i = 0; i < zones.length; i++) {
            await this._api.tx.dsMapsModule.rawZoneAdd(zones[0], height, rootId)
                .signAndSend(account.address, {signer: injector.signer}, ({ status, events, dispatchError }) => {
                    // status would still be set, but in the case of error we can shortcut
                    // to just check it (so an error would indicate InBlock or Finalized)
                    if (dispatchError) {
                      if (dispatchError.isModule) {
                        // for module errors, we have the section indexed, lookup
                        const decoded = this._api.registry.findMetaError(dispatchError.asModule);
                        const { documentation, name, section } = decoded;
                
                        console.log(`${section}.${name}: ${documentation.join(' ')}`);
                      } else {
                        // Other, CannotLookup, BadOrigin, no extra info
                        console.log(dispatchError.toString());
                      }
                    } else {
                        this.checkEvents();
                    }
                });
        }
    }

    async routeAdd(_route, _rootId, _startTime, _arrivalTime) {
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
        const rootId = _rootId;
        console.log(_startTime, _arrivalTime);
        const startTime = this._api.registry.createType('Moment', _startTime);
        const arrivalTime = this._api.registry.createType('Moment', _arrivalTime);

        const route = [];
        _route.forEach((_coord) => {
            route.push(this._api.registry.createType('RawCoord', _coord));
        });

        const account = this._userAccounts[1];
        const injector = await web3FromSource(account.meta.source);
        await this._api.tx.dsMapsModule.rawRouteAdd(route, startTime, arrivalTime, rootId)
            .signAndSend(account.address, {signer: injector.signer}, ({ status, events, dispatchError }) => {
                // status would still be set, but in the case of error we can shortcut
                // to just check it (so an error would indicate InBlock or Finalized)
                if (dispatchError) {
                  if (dispatchError.isModule) {
                    // for module errors, we have the section indexed, lookup
                    const decoded = this._api.registry.findMetaError(dispatchError.asModule);
                    const { documentation, name, section } = decoded;
            
                    console.log(`${section}.${name}: ${documentation.join(' ')}`);
                  } else {
                    // Other, CannotLookup, BadOrigin, no extra info
                    console.log(dispatchError.toString());
                  }
                } else {
                    this.checkEvents();
                }
              });
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
