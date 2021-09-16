import * as wasm from './wasm_indexes_bg.wasm';

/**
* @param {number} lat
* @param {number} lon
* @returns {number}
*/
export function index_generate(lat, lon) {
    var ret = wasm.index_generate(lat, lon);
    return ret >>> 0;
}

