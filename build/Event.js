"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event(args) {
        this.args = args;
        this.time = 0;
        this.token = args.token;
        this.event = args.event;
        this.customer_properties = args.customer_properties;
        this.properties = args.properties;
        this.time = args.time;
    }
    return Event;
}());
exports.Event = Event;
