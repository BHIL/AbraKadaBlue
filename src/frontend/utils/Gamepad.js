import Eventable from 'utils/Eventable';

const getGamepads = (navigator.getGamepads || navigator.webkitGetGamepads || (() => [])).bind(navigator);

class Gamepad extends Eventable {
    constructor() {
        super();
    }

    get(index) {
        return (getGamepads() || [])[index];
    }
}

const instance = new Gamepad();
Object.freeze(instance);

export default instance;