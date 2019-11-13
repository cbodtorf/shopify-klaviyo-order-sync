"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
/**
 * Note on Environment Variables:
 * ---
 * The || '' is there because by default Typescript interprets
 * environment variables to be be string | undefined.
 * undefined is undesirable so we convert to empty string.
 */
var KlaviyoApi_1 = require("./KlaviyoApi");
var ShopifyApi_1 = require("./ShopifyApi");
// Initialize KlaviyoApi
var publicApiKey = process.env.KLAVIYO_PUBLIC_API_KEY || '';
var klaviyo = new KlaviyoApi_1.KlaviyoApi(publicApiKey);
// Initialize ShopifyApi
var shopUrl = process.env.SHOP_URL || '';
var apiKey = process.env.SHOP_API_KEY || '';
var password = process.env.SHOP_PASSWORD || '';
var shopify = new ShopifyApi_1.ShopifyApi(shopUrl, apiKey, password);
// Initialize Shopify params
var params = {
    limit: 250,
    pMin: '2016-01-01T00:00:00-04:00',
    pMax: '2017-01-01T00:00:00-04:00',
    financialStatus: 'paid'
};
// Get Orders
shopify.getAllOrders(params).then(function (res) {
    var eventsToTrack = [];
    // Queue events
    res.orders.forEach(function (order) {
        var events = klaviyo.createEventsFromOrder(order);
        eventsToTrack = eventsToTrack.concat(events);
    });
    // Fire out tracking request
    eventsToTrack.forEach(function (event) {
        console.log('event:', event.event, ' => ', '$event_id:', event.properties.$event_id);
        klaviyo.track(event);
    });
});
