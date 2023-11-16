const EventEmitter = require("events");

class RandomChatEventsManager extends EventEmitter {

    /**@type {Function[]} */
    anyCallbacks = []

    constructor() {

        super();

    }

    emit() {

        this.anyCallbacks.forEach(callback => {

            const arrOfArgs = [arguments[0], ...arguments]

            callback.call(...arrOfArgs);

        })

        super.emit.call(this, ...arguments);

    }

    /**
     * Whenever any event occur passes event name and event args to provided callback
     * Do not pass callback as arrow function regular function is needed to work properly
     *  @param {Function} callback */
    onAny(callback) {

        this.anyCallbacks.push(callback);

    }

}


module.exports = RandomChatEventsManager;