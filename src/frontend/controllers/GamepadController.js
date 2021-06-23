import IController from 'controllers/IController';
import Gamepad from 'utils/Gamepad';
import {GAMEPAD_ANALOG_THRESHOLD} from 'consts';
import {abs} from 'utils/utils';

function buttonPressed(b) {
    if (typeof(b) == "object") {
      return b.pressed;
    }
    return b == 1.0;
}

export default class GamepadController extends IController {
    constructor(index) {
        super();

        this._index = index;
    }

    get_state() {
        const gamepad = Gamepad.get(this._index);
        if (gamepad === null) {
            return [0, 0, false];
        }

        this._orientation_x = (abs(gamepad.axes[0]) < GAMEPAD_ANALOG_THRESHOLD) ? 0 : gamepad.axes[0];
        this._orientation_y = (abs(gamepad.axes[1]) < GAMEPAD_ANALOG_THRESHOLD) ? 0 : gamepad.axes[1];
        this._special = buttonPressed(gamepad.buttons[0])
                     || buttonPressed(gamepad.buttons[1])
                     || buttonPressed(gamepad.buttons[2])
                     || buttonPressed(gamepad.buttons[3])
                     || buttonPressed(gamepad.buttons[4])
                     || buttonPressed(gamepad.buttons[5])
                     || buttonPressed(gamepad.buttons[6])
                     || buttonPressed(gamepad.buttons[7])
                     ;
        
        return [this._orientation_x, this._orientation_y, this._special];
    }
};