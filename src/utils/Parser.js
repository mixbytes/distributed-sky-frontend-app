import assert from 'assert';
import BN from 'bn.js';
import { toFixPoint } from '@encointer/util';

export default class Parser {
    parseToI9F23(value) {
        const toI9F23 = toFixPoint(9, 23);
        return toI9F23(value).toNumber();
    }

    // wrapping function, so type can be changed easily
    parseToCoord(value) {
        return this.parseToI9F23(value);
    }

    getTrimmedRect(data) {
        const rect = [];
        rect.push([this.trim(data[0].lat), this.trim(data[0].lng)]);
        rect.push([this.trim(data[2].lat), this.trim(data[2].lng)]);
        return rect;
    }

    trim(coord) {
        coord = parseFloat(coord.toFixed(1));
        return coord;
    }

    getRectCoords(data) {        
        // So somewhere here should be checks for non-zero, max dimensons, snapping => requires refactoring.
        // TODO make check, which coord is greater, swap points accordingly
        let box3D = [];
        const whatever = box3D.push(
            this.parseToCoord(data[0].lat),
            this.parseToCoord(data[0].lng),
            this.parseToCoord(1), 
            this.parseToCoord(data[2].lat),
            this.parseToCoord(data[2].lng),
            this.parseToCoord(2), 
            );
        return box3D;
    }
}