// /src/utils/EventEmitter.js

class EventEmitter {
    constructor() {
        this.events = {}; // stores event names and their registered listeners
    }

    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = []; // Initialize aray for new event names
        }
        this.events[eventName].push(listener); // add the listener to the event's list
    }

    emit(eventName, data) {
        if (this.events[eventName]) {
            //  Create a shallow copy of the listeners array to prevent issuse
            // if listeners are remove durring iteration (e.g.,'once' funtionality)
            [...this.events[eventName]].forEach(listener => listener(data));
        }
    }
}

export const appEvents = new EventEmitter();