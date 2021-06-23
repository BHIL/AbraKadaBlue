import Eventable from 'utils/Eventable';
import {Events} from 'enums';

class Keyboard extends Eventable {
    constructor() {
        super();

        document.body.addEventListener('keydown', this.on_keydown.bind(this));
        document.body.addEventListener('keyup', this.on_keyup.bind(this));
    }

    on_keydown({code}) {
        this.emit(Events.KEY_DOWN, code);
    }

    on_keyup({code}) {
        this.emit(Events.KEY_UP, code);
    }
}

const instance = new Keyboard();
Object.freeze(instance);

export default instance;