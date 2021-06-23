import Eventable from 'utils/Eventable';

export default class IController {
    constructor() {
        this._direction_x = 0;
        this._direction_y = 0;
        this._special = false;
    }

    get_state() {
        return [this._direction_x, this._direction_y, this._special];
    }
};