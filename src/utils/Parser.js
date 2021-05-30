import assert from 'assert';
import BN from 'bn.js';
import { toFixPoint } from '@encointer/util';

export default class Parser {
    parseToI9F23(value) {
        const toI9F23 = toFixPoint(9, 23);
        return toI9F23(value);
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
            this.parseToI9F23(data[0].lat).toNumber(),
            this.parseToI9F23(data[0].lng).toNumber(),
            this.parseToI9F23(1).toNumber(), 
            this.parseToI9F23(data[2].lat).toNumber(),
            this.parseToI9F23(data[2].lng).toNumber(),
            this.parseToI9F23(2).toNumber(), 
            );
        let rawDelta = this.parseToI9F23(0.1).toNumber();
        return [box3D, rawDelta];
    }
}