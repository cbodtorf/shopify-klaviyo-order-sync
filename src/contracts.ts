export interface IOrderLineItem {
  $event_id: string; // unique identifier for the order (eg. Order ID + line item name). 
  $value: number; // represents the total cost of an item in the order before any adjustments.
  id: number;
  title: string;
  name: string;
  price: number;
  variant_id: number;
  product_id: number;
  quantity: number;
  sku: string;
  variant_title: string;
  vendor: string;
}

export interface IEventLineItem {
  $event_id: string; // unique identifier for the order (eg. Order ID + line item name). 
  $value: number; // represents the total cost of an item in the order before any adjustments.
  ProductName: string;
  ProductID: number;
  Quantity: number;
  SKU: string;
  "Variant Name": string;
  Brand: string;
  ItemPrice: number;
  RowTotal: number;
}

export interface IAddress {
  address1?: string;
  address2?: string;
  city?: string;
  zip?: string;
  province?: string;
  country?: string;
}

export interface I$Address {
  $address1?: string;
  $address2?: string;
  $city?: string;
  $zip?: string;
  $region?: string;
  $country?: string;
}

export interface ICustomer {
  first_name: string;
  last_name: string;
  phone_number: string | undefined;
}

export interface I$Customer {
  $first_name?: string;
  $last_name?: string;
  $phone_number?: string;
  $email?: string;
}

export interface I$CustomerProperties extends I$Customer, I$Address {}

export interface IOrder {
  id: number;
  processed_at: string;
  email: string;
  customer: ICustomer;
  shipping_address: IAddress;
  billing_address: IAddress;
  line_items: IOrderLineItem[];
  total_price: number;
  total_discounts: number;
  financial_status: string;
  discount_codes: any[];
}

export interface IEventOrder {
  $event_id: string; // unique identifier for the order (eg. Order ID). 
  $value: number; // represents the total value of an entire order including shipping, tax, discounts, etc.
  ItemNames: string[];
  Brands: string[];
  "Discount Code": string;
  "Discount Value": number;
  shipping_address: IAddress;
  billing_address: IAddress;
  Items: IEventLineItem[];
}

export interface IParams {
  limit: number;
  pMin: string;
  pMax: string;
  financialStatus: string;
}

export interface RequestInterface {
  data: IOrder[];
}

export interface IEventSchema {
  token: string;
  event: string;
  customer_properties: I$CustomerProperties;
  properties: IEventOrder | IEventLineItem;
  time: number;
}