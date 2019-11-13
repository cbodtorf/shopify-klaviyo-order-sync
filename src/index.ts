require('dotenv').config()
/**
 * Note on Environment Variables:
 * ---
 * The || '' is there because by default Typescript interprets
 * environment variables to be be string | undefined.
 * undefined is undesirable so we convert to empty string.
 */


import { KlaviyoApi } from './KlaviyoApi';
import { ShopifyApi } from './ShopifyApi';
import { Event } from './Event';
import { IOrder, IParams } from './contracts';

// Initialize KlaviyoApi
const publicApiKey = process.env.KLAVIYO_PUBLIC_API_KEY || '';
const klaviyo = new KlaviyoApi(publicApiKey);

// Initialize ShopifyApi
const shopUrl = process.env.SHOP_URL || '';
const apiKey = process.env.SHOP_API_KEY || '';
const password = process.env.SHOP_PASSWORD || '';
const shopify = new ShopifyApi(shopUrl, apiKey, password);

// Initialize Shopify params
const params: IParams = {
  limit: 250,
  pMin: '2016-01-01T00:00:00-04:00',
  pMax: '2017-01-01T00:00:00-04:00',
  financialStatus: 'paid'
}

// Get Orders
shopify.getAllOrders(params).then((res: any): void => {
  let eventsToTrack: Event[] = [];

  // Queue events
  res.orders.forEach((order: IOrder): void => {
    const events = klaviyo.createEventsFromOrder(order);
    eventsToTrack = eventsToTrack.concat(events);
  });

  // Fire out tracking request
  eventsToTrack.forEach((event: Event): void => {
    console.log('event:', event.event, ' => ', '$event_id:', event.properties.$event_id);
    klaviyo.track(event);
  });
});