import axios from 'axios';
import { Event } from './Event'
import { I$CustomerProperties, IOrder, IOrderLineItem, RequestInterface, IEventLineItem } from './contracts'

export class KlaviyoApi {
  urlBase: string = 'https://a.klaviyo.com/api/track';

  constructor(public publicApiKey: string) {}

  // https://github.com/axios/axios#creating-an-instance
  // Could specifc more of config here
  private klaviyoAxios = axios.create();

  // simple utility for converting Date to unix timestamp.
  private unix(date: Date): number {
    return date.getTime()/1000|0;
  }

  public createEventsFromOrder(order: IOrder): Event[] {
    // Explicitly annotate type when instantiating blank value;
    // Order Props that depend on Line Item Iteration:
    const itemNames: string[] = [];
    const brands: string[] = [];
    const eventItems: IEventLineItem[] = [];

    const events: Event[] = [];
    const time = this.unix(new Date(order.processed_at));

    const customerProperties: I$CustomerProperties = {
      $email: order.email,
      $first_name: order.customer.first_name,
      $last_name: order.customer.last_name,
      $phone_number: order.customer.phone_number,
    };

    // Address is not guaranteed on an order.
    if (order.shipping_address) {
      customerProperties.$address1 = order.shipping_address.address1
      customerProperties.$address2 = order.shipping_address.address2
      customerProperties.$city = order.shipping_address.city
      customerProperties.$zip = order.shipping_address.zip
      customerProperties.$region = order.shipping_address.province
      customerProperties.$country = order.shipping_address.country
    };

    // Iterate through line items and push 'Ordered Product' events to queue
    order.line_items.forEach((item: IOrderLineItem): void => {
      // Set Klaviyo Specific Props for Item
      const eventItem: IEventLineItem = {
        $event_id: `${order.id}_${item.variant_id}`,
        $value: item.price,
        ProductName: item.name,
        ProductID: item.product_id,
        Quantity: item.quantity,
        SKU: item.sku,
        "Variant Name": item.variant_title,
        Brand: item.vendor,
        ItemPrice: item.price,
        RowTotal: item.price,
      }

      // push order level properties/
      itemNames.push(item.name);
      brands.push(item.vendor);
      eventItems.push(eventItem);

      const orderedProductEvent = new Event({
        token: this.publicApiKey,
        event: 'Ordered Product',
        customer_properties: customerProperties,
        properties: eventItem,
        time: time,
      });

      events.push(orderedProductEvent);
    });

    // Push 'Placed Order' event to queue
    const placeOrderEvent = new Event({
      token: this.publicApiKey,
      event: 'Placed Order',
      customer_properties: customerProperties,
      properties: {
        $event_id: `${order.id}`,
        $value: order.total_price,
        ItemNames: itemNames,
        Brands: brands,
        "Discount Code": order.discount_codes[0],
        "Discount Value": order.total_discounts,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        Items: eventItems
      },
      time: time,
    });

    events.push(placeOrderEvent);

    return events;
  }

  public async track(event: Event): Promise<void>{
    // Convert payload to string before converting to Base64
    const jsonString = JSON.stringify(event);
    // console.log('track event:', event.event, ' => ', 'e:', event);
    const data = Buffer.from(jsonString).toString('base64');

    await this.klaviyoAxios.get<RequestInterface>(this.urlBase, {
      params: { data } // Using destructing here
    });
  }
}