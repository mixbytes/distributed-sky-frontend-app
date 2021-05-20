// import newTypes from '@encointer/types';
import { Definitions } from '@polkadot/types/types';
import definitions from '@polkadot/types/interfaces/runtime/definitions';
// ...newTypes.types, 
export default {
    rpc: {},
    types: { ...definitions.types }
} as Definitions;