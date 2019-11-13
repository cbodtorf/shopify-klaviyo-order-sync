"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Event_1 = require("./Event");
var KlaviyoApi = /** @class */ (function () {
    function KlaviyoApi(publicApiKey) {
        this.publicApiKey = publicApiKey;
        this.urlBase = 'https://a.klaviyo.com/api/track';
        // https://github.com/axios/axios#creating-an-instance
        // Could specifc more of config here
        this.klaviyoAxios = axios_1.default.create();
    }
    // simple utility for converting Date to unix timestamp.
    KlaviyoApi.prototype.unix = function (date) {
        return date.getTime() / 1000 | 0;
    };
    KlaviyoApi.prototype.createEventsFromOrder = function (order) {
        var _this = this;
        // Set Klaviyo Specific Props for Order
        order.$event_id = "" + order.id;
        order.$value = order.total_price;
        // Explicitly annotate type when instantiating blank value;
        var events = [];
        var time = this.unix(new Date(order.processed_at));
        var customerProperties = {
            $email: order.email,
            $first_name: order.customer.first_name,
            $last_name: order.customer.last_name,
            $phone_number: order.customer.phone_number,
        };
        // Address is not guaranteed on an order.
        if (order.shipping_address) {
            customerProperties.$address1 = order.shipping_address.address1;
            customerProperties.$address2 = order.shipping_address.address2;
            customerProperties.$city = order.shipping_address.city;
            customerProperties.$zip = order.shipping_address.zip;
            customerProperties.$region = order.shipping_address.province;
            customerProperties.$country = order.shipping_address.country;
        }
        ;
        // Push 'Placed Order' event to queue
        var placeOrderEvent = new Event_1.Event({
            token: this.publicApiKey,
            event: 'Placed Order',
            customer_properties: customerProperties,
            properties: order,
            time: time,
        });
        events.push(placeOrderEvent);
        // Iterate through line items and push 'Ordered Product' events to queue
        order.line_items.forEach(function (item) {
            // Set Klaviyo Specific Props for Item
            item.$event_id = order.id + "_" + item.name;
            item.$value = item.price;
            var orderedProductEvent = new Event_1.Event({
                token: _this.publicApiKey,
                event: 'Ordered Product',
                customer_properties: customerProperties,
                properties: item,
                time: time,
            });
            events.push(orderedProductEvent);
        });
        return events;
    };
    KlaviyoApi.prototype.track = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonString, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonString = JSON.stringify(event);
                        data = Buffer.from(jsonString).toString('base64');
                        return [4 /*yield*/, this.klaviyoAxios.get(this.urlBase, {
                                params: { data: data } // Using destructing here
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return KlaviyoApi;
}());
exports.KlaviyoApi = KlaviyoApi;
