import { IEventSchema, IOrder, ILineItem } from './contracts'

export class Event implements IEventSchema {
  token: string;
  event: string;
  customer_properties: object;
  properties: IOrder | ILineItem;
  time: number = 0;

  constructor(private args: IEventSchema) {
    this.token = args.token;
    this.event = args.event;
    this.customer_properties = args.customer_properties;
    this.properties = args.properties;
    this.time = args.time;
  }
}