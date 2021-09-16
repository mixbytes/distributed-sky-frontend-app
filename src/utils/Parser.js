import {toFixPoint, parserFixPoint} from '@encointer/util';
import BN from 'bn.js';

export default class Parser {
    static _parseToI10F22(value) {
        const toI10F22 = toFixPoint(10, 22);
        return toI10F22(value).toNumber();
    }

    static parseToI10F22(value) {
        const toI10F22 = toFixPoint(10, 22);
        return toI10F22(value).toNumber();
    }
    
    // wrapping function, so type can be changed easily
    static parseToCoord(value) {

        return this._parseToI10F22(value);
    }

    static _parseFromI10F22(value) {
        const fromI10F22 = parserFixPoint(10, 22);
        return parseFloat(fromI10F22(value));
    }

    // wrapping function, so type can be changed easily
    static parseFromCoord(value) {
        const bnValue = new BN(value, 10);
        return this._parseFromI10F22(bnValue);
    }

    static parseNodeOutput(stringValue) {
        const value = parseInt(stringValue.split(',').join(''));
        return this.parseFromCoord(value);

    }

    static getTrimmedRect(data) {
        const rect = [];
        rect.push([this.trimTo(data[0].lat, 1), this.trimTo(data[0].lng, 1)]);
        rect.push([this.trimTo(data[2].lat, 1), this.trimTo(data[2].lng, 1)]);
        return rect;
    }

    // Note. there is default numeration in leaflet, so fn is correct for any selected rect.
    // Output is default array, as used in leaflet [[sw_lat, sw_lon], [ne_lat, ne_lon]]
    static getRect(data) {
        const rect = [
            [data[0].lat, data[0].lng],
            [data[2].lat, data[2].lng],
        ];
        return rect;
    }
    // TODO there is a lot of self-repeat, refactor all Parser
    static getLine(data) {
        const line = [
            [this.trimTo(data[0].lat, 7), this.trimTo(data[0].lng, 7)],
            [this.trimTo(data[1].lat, 7), this.trimTo(data[1].lng, 7)],
        ];
        return line;
    }

    // (55.63962388406009,  3) => 55.640 (fn with rounding)
    static trimTo(coord, limit) {
        coord = parseFloat(coord.toFixed(limit));
        return coord;
    }

    static getBoxCoords(data) {
        // So somewhere here should be checks for non-zero, max dimensons, snapping => requires refactoring.
        // TODO make check, which coord is greater, swap points accordingly
        const box3D = [];
        box3D.push(
            this.parseToCoord(data[0].lat),
            this.parseToCoord(data[0].lng),
            this.parseToCoord(1),
            this.parseToCoord(data[2].lat),
            this.parseToCoord(data[2].lng),
            this.parseToCoord(2),
        );
        return box3D;
    }

    static getRectCoords(data) {
        // So somewhere here should be checks for non-zero, max dimensons, snapping => requires refactoring.
        // TODO make check, which coord is greater, swap points accordingly
        const rect = [];
        rect.push(
            this.parseToCoord(data[0][0]),
            this.parseToCoord(data[0][1]),
            this.parseToCoord(data[1][0]),
            this.parseToCoord(data[1][1]),
        );
        return rect;
    }
}
