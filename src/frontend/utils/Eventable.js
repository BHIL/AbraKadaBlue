export default class Eventable {
    constructor() {
        this._callbacks = {};
    }

    on(event, callback) {
		if (!this._callbacks[event])
			this._callbacks[event] = [];

		this._callbacks[event].push(callback.bind(this));

		return this;
    }

    emit(event, ...args) {
        var callbacks = this._callbacks[event];
		if (callbacks) {
			callbacks.forEach(callback => 
				callback(...args)
			);
		}

		return this;
    }
};