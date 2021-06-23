import IController from 'controllers/IController';
import Keyboard from 'utils/Keyboard';
import {Events, Buttons} from 'enums';

const HOLD_KEY_SPEED = 1;

export default class KeyboardController extends IController {
    constructor(key_mapping) {
        super();

        this._key_mapping = key_mapping;

        Keyboard.on(Events.KEY_DOWN, this.on_key_down.bind(this));
        Keyboard.on(Events.KEY_UP, this.on_key_up.bind(this));

        this._direction = null;
        this._special = false;
    }

    get direction() {
        return this._direction;
    }

    get special() {
        return this._special;
    }

    on_key_down(keycode) {
        const button = this._key_mapping[keycode];
        if (button == Buttons.UP) {
            this._direction = Buttons.UP;
        }
        else if (button == Buttons.DOWN) {
            this._direction = Buttons.DOWN;
        }
        else if (button == Buttons.LEFT) {
            this._direction = Buttons.LEFT;
        }
        else if (button == Buttons.RIGHT) {
            this._direction = Buttons.RIGHT;
        }
        else if (button == Buttons.SPECIAL) {
            this._special = true;
        }
    }

    on_key_up(keycode) {
        const button = this._key_mapping[keycode];
        if (button == Buttons.UP) {
            this._direction = null;
        }
        else if (button == Buttons.DOWN) {
            this._direction = null;
        }
        else if (button == Buttons.LEFT) {
            this._direction = null;
        }
        else if (button == Buttons.RIGHT) {
            this._direction = null;
        }
        else if (button == Buttons.SPECIAL) {
            this._special = false;
        }
    }
};