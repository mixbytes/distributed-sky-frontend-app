// import { toFixPoint } from '@encointer/util';

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
        this.coords = {
            south_west_lat: '',
            south_west_lon: '',
            north_east_lat: '',
            north_east_lon: '',
            lat_def: '',
        };

        // So somewhere here should be checks for non-zero, max dimensons, snapping => requires refactoring.
        // TODO make check, which coord is greater, swap points accordingly
        this.coords.south_west_lat = this.parseToI9F23(data[0].lat);
        this.coords.south_west_lon = this.parseToI9F23(data[0].lng);
        this.coords.north_east_lat = this.parseToI9F23(data[2].lat);
        this.coords.north_east_lon = this.parseToI9F23(data[2].lng);
        this.coords.lat_def = this.parseToI9F23(1);
        return this.coords;
    }
}
