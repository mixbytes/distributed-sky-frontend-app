import {toFixPoint} from '@encointer/util';

export default class Parser {
    static parseToI10F22(value) {
        const toI10F22 = toFixPoint(10, 22);
        return toI10F22(value).toNumber();
    }

    // wrapping function, so type can be changed easily
    static parseToCoord(value) {
        return this.parseToI10F22(value);
    }

    static getTrimmedRect(data) {
        const rect = [];
        rect.push([this.trim(data[0].lat), this.trim(data[0].lng)]);
        rect.push([this.trim(data[2].lat), this.trim(data[2].lng)]);
        return rect;
    }

    static trim(coord) {
        coord = parseFloat(coord.toFixed(1));
        return coord;
    }

    static getRectCoords(data) {
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
}
